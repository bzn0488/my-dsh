import { readdir, readFile, stat } from 'node:fs/promises'
import { resolve, join, relative, sep } from 'node:path'
import { parse as parseYaml } from 'yaml'

const MAX_SKILL_FILE_BYTES = 512 * 1024
const MAX_REFERENCE_FILE_BYTES = 256 * 1024
const MAX_REFERENCE_ENTRIES = 100
const SKILL_ROOT = resolve(process.env.DSH_AGENTS_HOME ?? join(process.env.USERPROFILE ?? process.cwd(), '.agents'), 'skills')

export const name = 'skill-library'
export const inject = ['webServer']

function isLoopbackRequest(request) {
  const address = request.socket.remoteAddress
  if (address !== '127.0.0.1' && address !== '::1' && address !== '::ffff:127.0.0.1') return false
  const host = request.headers.host
  if (typeof host !== 'string') return false
  let hostUrl
  try { hostUrl = new URL(`http://${host}`) } catch { return false }
  if (hostUrl.hostname !== '127.0.0.1' && hostUrl.hostname !== 'localhost' && hostUrl.hostname !== '[::1]') return false
  if (request.headers['sec-fetch-site'] === 'cross-site') return false
  const origin = request.headers.origin
  if (origin === undefined) return true
  try { return new URL(origin).host === hostUrl.host } catch { return false }
}

function sendJson(response, status, body) {
  response.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'referrer-policy': 'no-referrer',
  })
  response.end(JSON.stringify(body))
}

function asObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value) ? value : {}
}

function scalar(value) {
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return value
  return undefined
}

/** Parse the YAML frontmatter used by DSH skills, including folded strings and lists. */
function parseFrontmatter(markdown) {
  if (!markdown.startsWith('---')) return { metadata: {}, body: markdown }
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(markdown)
  if (match === null) return { metadata: {}, body: markdown }
  try {
    return { metadata: asObject(parseYaml(match[1])), body: markdown.slice(match[0].length) }
  } catch {
    // A malformed skill must remain browsable rather than taking down the whole list.
    return { metadata: {}, body: markdown }
  }
}

function stringField(metadata, field) {
  const value = scalar(metadata[field])
  return value === undefined ? undefined : String(value)
}

function stringList(value) {
  return Array.isArray(value) ? value.filter(item => typeof item === 'string') : []
}

async function safeRead(path, maxBytes) {
  const info = await stat(path)
  if (!info.isFile() || info.size > maxBytes) return undefined
  return readFile(path, 'utf8')
}

async function listReferences(skillDir) {
  const referencesDir = join(skillDir, 'references')
  let entries
  try { entries = await readdir(referencesDir, { withFileTypes: true }) } catch { return [] }
  return entries
    .filter(entry => entry.isFile() && /\.(md|txt)$/i.test(entry.name))
    .slice(0, MAX_REFERENCE_ENTRIES)
    .map(entry => entry.name)
    .sort((left, right) => left.localeCompare(right))
}

async function skillFromDirectory(entry) {
  const directory = join(SKILL_ROOT, entry.name)
  const path = join(directory, 'SKILL.md')
  const markdown = await safeRead(path, MAX_SKILL_FILE_BYTES)
  if (markdown === undefined) return undefined
  const { metadata, body } = parseFrontmatter(markdown)
  const name = stringField(metadata, 'name') ?? entry.name
  const description = stringField(metadata, 'description') ?? ''
  return {
    id: entry.name,
    name,
    description,
    whenToUse: stringField(metadata, 'whenToUse') ?? '',
    triggers: stringList(metadata.triggers),
    tags: stringList(metadata.tags),
    category: stringField(metadata, 'category') ?? '',
    version: stringField(metadata, 'version') ?? '',
    status: stringField(metadata, 'status') ?? 'active',
    disableModelInvocation: metadata['disable-model-invocation'] === true,
    userInvocable: metadata['user-invocable'] !== false,
    references: await listReferences(directory),
    path: relative(process.cwd(), path).split(sep).join('/'),
    updatedAt: (await stat(path)).mtimeMs,
    body,
  }
}

async function listSkills() {
  let entries
  try { entries = await readdir(SKILL_ROOT, { withFileTypes: true }) } catch { return [] }
  const skills = await Promise.all(entries.filter(entry => entry.isDirectory()).map(skillFromDirectory))
  return skills.filter(Boolean).sort((left, right) => left.name.localeCompare(right.name))
}

async function readReference(skillId, fileName) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(skillId)) return undefined
  if (!/^[^\\/]+\.(md|txt)$/i.test(fileName)) return undefined
  const path = resolve(SKILL_ROOT, skillId, 'references', fileName)
  const expected = resolve(SKILL_ROOT, skillId, 'references') + sep
  if (!path.startsWith(expected)) return undefined
  return safeRead(path, MAX_REFERENCE_FILE_BYTES)
}

function routes() {
  return [
    {
      kind: 'exact',
      path: '/api/skill-library/skills',
      handler: async (request, response) => {
        if (!isLoopbackRequest(request)) return sendJson(response, 403, { error: 'forbidden: loopback-only' })
        if (request.method !== 'GET') return sendJson(response, 405, { error: 'method not allowed' })
        try {
          const skills = await listSkills()
          sendJson(response, 200, { root: SKILL_ROOT, skills })
        } catch (error) {
          sendJson(response, 500, { error: error instanceof Error ? error.message : String(error) })
        }
      },
    },
    {
      kind: 'exact',
      path: '/api/skill-library/reference',
      handler: async (request, response) => {
        if (!isLoopbackRequest(request)) return sendJson(response, 403, { error: 'forbidden: loopback-only' })
        if (request.method !== 'GET') return sendJson(response, 405, { error: 'method not allowed' })
        const url = new URL(request.url ?? '/', 'http://localhost')
        const skill = url.searchParams.get('skill') ?? ''
        const file = url.searchParams.get('file') ?? ''
        try {
          const content = await readReference(skill, file)
          if (content === undefined) return sendJson(response, 404, { error: 'reference not found' })
          sendJson(response, 200, { content })
        } catch (error) {
          sendJson(response, 500, { error: error instanceof Error ? error.message : String(error) })
        }
      },
    },
  ]
}

export function apply(ctx) {
  const disposers = routes().map(route => ctx.webServer.register(route))
  ctx.effect(() => () => { for (const dispose of disposers) dispose() }, 'skill-library: routes')
}
