---
name: workstation-git-governance
description: Decide what enters version control for this user's self-contained personal workstation project, following their open-box-ready philosophy.
whenToUse: When the user asks which files/folders of their workstation project (Deepseek Harness / dotfiles-style repo) should be in git, asks to review what is tracked vs untracked, or discusses repos, config, memory/knowledge/plugins/projects inclusion policy.
distilled-by: dsh-distill
---

# Version-Control Governance for the Personal Workstation

## User's stated philosophy (validate, don't contradict)
The user's workstation repo should be **self-contained and open-box-ready on any machine**: it travels with them as THEIR personal workstation. Apply these rules when advising on git inclusion:

- **Track everything that is part of the workstation** unless it is a truly low-level foundation dependency (e.g. a runtime like `node` itself).
- **Track the produced intelligence and state**: memories, knowledge, skills, persistent session/conversation records, projects, and installed plugins/config — these are core deliverables, not clutter.
- **Exclude only foundational runtime deps** that are normally installed outside the project (e.g. `node_modules` equivalent / language runtimes), plus transient machine-local state you agree on.

## How to operate
- When the user says "discuss what should be in version control", **discuss first — ask/iterate — before writing `gitignore` or staged changes.** Present the inclusion decision per category (foundation deps, config, memory/knowledge/skills, session records, projects, plugins) and get agreement before acting.
- When asked "what's currently tracked vs untracked", report concretely: `git status` grouped into tracked vs untracked/ignored, and explicitly connect each group to the policy above so the user can decide.
- When a change is made, **verify with `git status`** and confirm the intended files actually show up before declaring success.

## Pitfalls
- Do NOT blanket-track everything without pausing on foundation deps — the user explicitly wants a deliberate policy, not a default "track all".
- Do NOT recommend committing large runtime/toolchain installs; keep the boundary at foundational deps as the user defined it.
- If the user asks about progress on a slow operation, give a concrete stage/progress instead of silence; but do not treat build/install slowness as a git-policy matter — it is environment state.
