---
name: knowledge-base-design
description: Design and operate a knowledge base as semantic memory that complements, rather than replaces, procedural skills.
whenToUse: Use when discussing, designing, populating, or integrating a user-facing knowledge base alongside an agent skill library.
distilled-by: dsh-distill
---

# Knowledge-Base Design

## Core model

Treat the **knowledge base** and **skill library** as distinct, complementary memory systems:

| System | Kind of memory | Primary purpose | Typical contents |
|---|---|---|---|
| Knowledge base | Semantic / declarative memory | Establish shared understanding and interpret the user’s domain language | Terminology, definitions, concepts, taxonomies, background documents, domain relationships |
| Skill library | Procedural memory | Guide execution of repeatable work | Step-by-step workflows, tool usage, validation criteria, pitfalls, templates |

A knowledge base lets the agent understand what the user means when specialized terminology appears. A skill tells the agent how to carry out work reliably. Do not use abstract background knowledge as a substitute for a validated operational procedure.

## How to reason about retrieval

1. **Interpret first.** When the user uses a domain term, acronym, named method, or concept whose meaning is unclear or may be organization-specific, consult the knowledge base to establish shared semantics.
2. **Execute with procedure.** Once the task is understood, use the applicable skill or task-specific procedure for the actual work. Knowledge-base material may supply context and constraints, but should not be blindly converted into operational instructions.
3. **Ask rather than invent.** If a term is ambiguous and no authoritative knowledge entry resolves it, ask the user for the intended definition before relying on it.
4. **Keep the boundary clean.** Put stable facts and meanings in the knowledge base; put reusable methods in skills. If a knowledge entry contains an execution sequence, distill the validated procedure into a skill instead of making the knowledge base the default runbook.

## Knowledge ingestion flows

Support two first-class routes into the knowledge base.

### 1. External document import

Provide an import-document flow for user-supplied introductory or reference materials.

- Preserve source metadata: title or filename, source location or origin, import time, author/owner when known, and version/date when available.
- Treat imported material as source-backed knowledge, not automatically as universal truth.
- Extract and index concepts, terminology, and relationships so they can be retrieved semantically.
- Preserve traceability from each derived entry back to its source document and relevant passage.
- Make duplicate and contradiction handling explicit: link related entries, retain provenance, and surface conflicts rather than silently overwriting definitions.

### 2. Conversational definition capture

During conversation, detect when the user supplies a meaningful domain definition in response to uncertainty or correction. For example, if the user explains what an organization-specific technique means, offer or invoke the dedicated knowledge-base write tool to record it.

Before writing:

1. Identify the term or concept and the user-provided definition.
2. Capture sufficient surrounding context: scope, exceptions, examples, related terms, and any stated source or authority.
3. Avoid promoting speculation, temporary decisions, or unconfirmed interpretations into durable knowledge.
4. Check for an existing entry when possible. Update, version, or flag a conflict instead of creating indistinguishable duplicates.
5. Record provenance as a conversation-derived definition, including date and the user/session authority where the system supports it.

After writing, acknowledge concisely what was captured and preserve an editable/reviewable path for the user.

## Entry quality standard

Each knowledge entry should aim to answer:

- **What is it?** A clear definition.
- **When does it apply?** Scope and context.
- **What is it not?** Boundaries, counterexamples, or common confusions when useful.
- **Why trust it?** Source and provenance.
- **What relates to it?** Synonyms, parent/child concepts, and associated terms.

Use the user’s own domain wording alongside normalized aliases so future conversations recognize both forms.

## Design safeguards

- Knowledge ingestion is a durable write: require an explicit user preference, an established automatic-capture policy, or a clear tool-triggering instruction before storing conversational material.
- Keep permissions, retention, provenance, editing, deletion, and export visible in the product design.
- Do not let retrieval hide uncertainty. Clearly distinguish authoritative imported material, user-defined terms, inferred summaries, and conflicting definitions.
- Do not store credentials, private secrets, or sensitive operational data merely because it appeared in a document or conversation; apply the system’s data-handling policy first.

## Discussion framing

When discussing this architecture with a user, explain the distinction in practical terms: the knowledge base is the shared vocabulary required to understand their professional world; the skill library is the practiced playbook needed to perform work within it. Emphasize that both are necessary, but they solve different failure modes.
