---
layout: default
title: Inner MCP Documentation
description: "documentation for integrating the Inner MCP server with ChatGPT, Claude, and other MCP-compatible clients."
sitemap: false
---

# Inner MCP Documentation

**Inner** is a personal memory layer for LLMs. It helps users capture emotionally meaningful experiences, surface patterns over time, and learn what actually helps them.

This page documents the Inner MCP server for integration with ChatGPT, Claude, and other MCP-compatible clients.

## Overview

Inner provides tools for storing and retrieving **inner memories** — structured records of emotionally significant moments. Each memory captures:

- **What happened** (title, summary)
- **How it felt** (primary emotion, intensity, secondary emotions)
- **Physical sensations** (body signals like chest tightness, butterflies)
- **Patterns** (triggers, needs, relational dynamics)
- **Resolution** (what helped, current state)

Memories progress through states: **open** → **integrating** → **resolved**.

## Authentication

Inner uses OAuth 2.0 with Auth0. Required scopes:

- `inner.memories:read` — read and search memories
- `inner.memories:write` — create, update, and delete memories

## Tools

### saveMemoryOrb

Create a new inner memory when the user shares an emotionally important experience.

**Parameters:**
- `title` (required) — short human title
- `summary` (required) — 1-3 sentence summary
- `source` (required) — `{ type: "manual" | "dream" | "message" }`
- `emotions` (required) — `{ primary: string, intensity: 0-1, secondary?: string[] }`
- `triggers` — what triggered this state
- `needs` — what's needed to resolve it
- `bodySignals` — physical sensations (e.g., "chest tightness", "butterflies")
- `symbols`, `dynamics` — thematic patterns

**Example prompt:** *"I'm feeling anxious before a job interview. My chest feels tight. Please save this as an Inner memory."*

---

### listMemories

List the user's recent inner memories.

**Parameters:**
- `limit` — max results (default 20)
- `state` — filter by "open", "integrating", or "resolved"

**Example prompt:** *"Show my Inner memories."*

---

### recallMemories

Search memories by semantic similarity — find past experiences related to a feeling, situation, or theme.

**Parameters:**
- `query` (required) — what to search for (e.g., "anxiety", "work stress")
- `limit` — max results (default 10)

**Example prompt:** *"Find Inner memories related to anxiety."*

---

### addOrbEvent

Add an observation or update to an existing memory. Use this when the user notices something new or takes a step.

**Parameters:**
- `orbId` (required) — memory ID
- `type` (required) — "observe", "learn", or "act"
- `note` — what happened
- `delta` — optional state or intensity changes

**Example prompt:** *"Add an observation to my most recent memory: after breathing exercises, my anxiety decreased."*

---

### updateOrb

Edit a memory's details (title, summary, emotions, etc.).

**Parameters:**
- `orbId` (required) — memory ID
- Any fields to update: `title`, `summary`, `emotions`, `triggers`, `needs`, `bodySignals`, `resolutionState`

**Example prompt:** *"Update the title of my most recent memory to 'job interview nerves'."*

---

### resolveOrb

Mark a memory as resolved and capture what helped.

**Parameters:**
- `orbId` (required) — memory ID
- `whatHelped` — what specifically helped resolve this
- `note` — optional additional context

**Example prompt:** *"Resolve this memory. What helped was preparation and breathing exercises."*

---

### deleteOrb

Permanently delete a memory.

**Parameters:**
- `orbId` (required) — memory ID

---

## Example Workflow

1. **Capture:** User shares an anxious moment → `saveMemoryOrb`
2. **Review:** User asks to see their memories → `listMemories`
3. **Pattern:** User searches for similar experiences → `recallMemories`
4. **Observe:** User notices what helps → `addOrbEvent`
5. **Refine:** User updates the title → `updateOrb`
6. **Resolve:** User marks it resolved with learnings → `resolveOrb`

## Support

For questions or issues, contact [reducibl@gmail.com](mailto:reducibl@gmail.com).
