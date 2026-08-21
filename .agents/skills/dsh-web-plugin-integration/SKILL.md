---
name: dsh-web-plugin-integration
description: Build and verify DSH Web GUI plugin surfaces, navigation, and data listings without mistaking source edits for deployed UI changes.
whenToUse: Use when adding or changing a DSH Web GUI plugin, sidebar entry, route, panel, navigation behavior, or plugin-provided data view.
distilled-by: dsh-distill
---

# DSH Web Plugin Integration

## Purpose

Implement DSH Web GUI features so they are reachable from the real running GUI, preserve session navigation, and display the complete intended data set. Treat source changes, artifact rebuilds, and visible behavior in the existing DSH GUI as separate checkpoints.

## Start with a user-visible design artifact

When the user asks to first establish a plan or a document before implementation, create that reusable design/implementation document first. It should state:

- the new entry point and its location in the GUI;
- primary views and navigation paths;
- data sources, ownership boundaries, and inclusion rules;
- return/exit behavior for every view entered from an existing conversation;
- how the feature will be verified in the actual GUI.

Do not silently skip this stage by immediately coding. Use the document as the agreement for later construction or discussion.

## Discover the integration boundary

1. Determine the current working directory with `pwd`; do not infer it from any documented checkout path.
2. For DSH implementation inspection or extension, use the supplied DSH checkout path, but do not assume it is the workspace.
3. Identify whether the change belongs to:
   - a client plugin bundle;
   - the `apps/web` shell;
   - a plain package or backend route; or
   - more than one layer.
4. Trace the existing neighboring sidebar entries and screens before adding a new one. Follow their registration, routing, state, icon, localization, and lifecycle conventions rather than creating a parallel navigation system.
5. Define the view state explicitly: source screen, target screen, selected item, and a deterministic destination for close/back actions.

## Build sidebar and navigation changes correctly

When adding a top-level entry near existing plugin entries such as task board or SSH:

1. Add the entry through the same host/plugin registration mechanism used by those entries.
2. Render a usable landing view, not only a dead navigation label.
3. Preserve the active conversation/session identity before opening the plugin view.
4. Implement return behavior deliberately:
   - closing or leaving a plugin view opened from a conversation must restore that conversation when that is the user’s expected context;
   - browser-history/back behavior and in-app back/close behavior must agree;
   - avoid replacing the session route/state with a plugin route in a way that loses the return target.
5. Test the full transition, not merely that the menu item appears: conversation → plugin → select/open content → return to conversation.

A visible feature with a broken exit path is incomplete.

## Data completeness for library/listing views

Before declaring a new library or catalog view done, define what it promises to show. For a skills library, distinguish at least:

- bundled or built-in skills;
- runtime-registered skills;
- user-owned skills; and
- distill-owned/generated skills.

Do not populate the UI from only the most convenient source if the product promise is to show the library. Trace all supported sources and apply transparent inclusion rules. If some classes are deliberately excluded, make the rule clear in the interface or accompanying documentation rather than allowing an apparently incomplete list to look like data loss.

Verify with representative records from every intended class, including generated/distilled records when they are expected to be visible. Check counts and inspect individual entries rather than validating only an empty-state or one hard-coded example.

## Rebuild and validate the real GUI

A source edit is not evidence that the GUI updated.

1. Determine the affected artifact.
2. For client-plugin changes, hot reload is available only when `pnpm run dev:web` is running from the same DSH checkout and rebuilding the plugin bundles. Verify that watcher before promising automatic updates.
3. For `apps/web` shell and plain-package changes, rebuild the affected web artifacts; they require a refresh of the existing DSH GUI URL.
4. Do not start a replacement server merely to view a change. The `apps/web` Vite entry is not a standalone DSH application because DSH supplies `window.__DSH_BOOT__`.
5. Inspect the existing GUI at `http://127.0.0.1:3080` after the required rebuild/refresh. Confirm all of:
   - the entry is visibly present in the intended sidebar location;
   - the landing view renders;
   - expected data appears and is complete;
   - navigation back to the originating session works.

If the user reports that the frontend has not changed, do not assume their restart was insufficient. Re-check which artifact was built, whether the correct watcher is running for plugin HMR, whether the existing GUI was refreshed where necessary, and whether the registered bundle actually contains the change.

## Completion checklist

Report completion only after:

- the agreed document/design exists when requested;
- the feature is available through the intended DSH GUI entry point;
- the existing GUI has been rebuilt/refreshed as required and visibly verified;
- forward and return navigation work from a real conversation;
- library/data views include every promised source category; and
- changed files and verification results are stated plainly.

