---
title: "LLM ≠ Agent: How Coding Agents Actually Work"
date: "2026-03-07"
excerpt: "I read through real agent codebases to understand what sits between 'call an LLM' and 'ship a coding product'. The answer is the system around the model."
tags: ["ai", "agents", "engineering", "codex", "opencode", "claude code", "cursor"]
author: "Nir Zabari"
--- 

<img src="./h2.jpeg" alt="Harness System"  />


## My Brief Timeline with Coding Agents

1. **Text models.** Computer vision, my main expertise, was much more mature - <a href="https://arxiv.org/abs/1512.03385" target="_blank">ResNets</a>, <a href="https://arxiv.org/abs/1506.02640" target="_blank">YOLO</a>, and other models covered most practical needs in production. For NLP, the breakthrough came later with <a href="https://arxiv.org/abs/1810.04805" target="_blank">BERT</a>, where sentiment analysis-like tasks were the most common deployment scenario. Makes sense: vision had its <a href="https://papers.nips.cc/paper/2012/hash/c399862d3b9d6b76c8436e924a68c45b-Abstract.html" target="_blank">ImageNet moment in 2012</a>, while NLP's path was more gradual - the Transformer was a major breakthrough in 2017, and BERT in late 2018 was the moment pretrained language models really became mainstream for many practical text tasks. I learned about all of this during my MSc; people outside CS didn't know about it at all back then.
2. **GPT Series.** text generation started looking promising. <a href="https://openai.com/index/language-unsupervised/" target="_blank">GPT-1</a> and <a href="https://openai.com/index/better-language-models/" target="_blank">GPT-2</a> showed the direction, then <a href="https://arxiv.org/abs/2005.14165" target="_blank">GPT-3</a> was a massive step up. People were hyped about the generations, and that was just with pretraining on internet-scale data. This was a recurring theme in OpenAI's research at the time: scale up data from the web and see what emerges (<a href="https://openai.com/index/clip/" target="_blank">CLIP</a>, <a href="https://openai.com/index/dall-e/" target="_blank">DALL-E</a>, and others following the same playbook).
3. **ChatGPT: the first harness.** <a href="https://arxiv.org/abs/2203.02155" target="_blank">RLHF</a> and instruction tuning were a big part of what turned GPT-style models into ChatGPT, and the chat interface made that capability broadly usable for mainstream users. OpenAI releasing it as a public research preview was a bold move, and at the time not every large lab was willing to ship something like that. People got curious about which prompts yield the best results - "prompt engineering" went from niche term for researchers and builders to the mainstream.
4. **Workflows.** In 2021–22 I worked at Microsoft on <a href="https://www.microsoft.com/en-us/dynamics-365/products/sales" target="_blank">Dynamics 365 Sales</a> (Microsoft's Salesforce competitor). We had access to OpenAI's GPT-3 API, back in the text-davinci days, before ChatGPT was a thing. I integrated it into the sales team for auto-reply and various features to help sellers - basically building AI workflows before "AI workflows" was a term anyone used. By late 2022, <a href="https://github.com/langchain-ai/langchain" target="_blank">LangChain</a> started trying to formalize this into chains and pipelines, but the models weren't capable enough for most of it, so we all tried to hack these models into useful products with all sorts of design patterns. Fast forward to today - with much stronger models, a well written system prompt can often one-shot what used to require a multi-step pipeline. The whole "orchestration layer" doesn't disappear, but a lot of what used to be explicit pipeline logic gets collapsed into the model. That said, LangChain-style routing is still relevant: when you factor in pricing, it makes sense to route cheap models for simple steps and reserve frontier models for the hard parts.
5. **Model specialization.** For a while, ChatGPT was the model - the default for "retail," great for writing and basic coding. That's no longer the case. Today I find myself routing to different models depending on the task. Hebrew conversations and easily-searchable topics? <a href="https://gemini.google.com" target="_blank">Gemini</a> - its multilingual quality is noticeably better (at least with Hebrew). Coding and technical work? <a href="https://www.anthropic.com" target="_blank">Anthropic models</a>. Deep math, paper analysis, or thorough web research? <a href="https://openai.com/index/introducing-o3-and-o4-mini/" target="_blank">ChatGPT with extended thinking</a> or the Pro model. Each player seems to focus their efforts on a slightly different field.
6. **Agentic coding.** We moved from simple workflows to models capable enough to take a task, break it into subtasks, execute them, and verify the results. As a developer, the main tools I've experimented with are <a href="https://cursor.com" target="_blank">Cursor</a> (a VSCode fork++), <a href="https://docs.anthropic.com/en/docs/claude-code" target="_blank">Claude Code</a>, <a href="https://github.com/openai/codex" target="_blank">Codex CLI</a>, and <a href="https://github.com/anomalyco/opencode" target="_blank">OpenCode</a>. Anthropic's models have been the best for coding consistently: I can hand off a task and with minimal supervision get it done. The moment it clicked for me: I rewrote an internal data loader - one that had been developed over months in C++ and was running at scale in Rust, a language I had started learning only a week earlier. Claude Code handled it in a couple of sessions, passed the integration tests, and matched the performance (and sometimes was a bit faster) of the original data loader. It wasn't a one-shot; I had to define the contract, plan it carefully, and make sure it integrates well. But the main code and all the bells and whistles were done by Claude. All I had to do was supervise and direct.

Agents and LLMs are becoming vital in our day-to-day as developers - and increasingly part of everyday life. What’s really under the hood?

I was curious to look at the source code of a real product, not a model. An LLM is typically a gigantic transformer that predicts the next token given a system prompt and a context. But how do you use that building block to create an impressive and capable product - a <a href="https://openai.com/index/harness-engineering/" target="_blank">**harness**</a>?

<img src="./img1.jpeg" alt="Harness System" style="max-height: 300px;" />


From a user's perspective, there have been four big jumps in AI capability so far:

1. **GPT-3.5** (ChatGPT, November 2022) - the leap was the product itself, not just the model
2. **GPT-4** (Spring 2023)
3. **Reasoning models** (publicly marked by o1-preview, then becoming much more practical with o3 in Spring 2025)
4. **Actually useful agentic systems** (by late 2025, once strong reasoning models were paired with solid harnesses)

This post is mostly about that fourth jump: what it takes to turn a strong model into a system that is genuinely useful.

## The Simplest Agent That Works?

Here's the simplest version of an agentic coding system that actually works: the [ralph wiggum loop](https://ghuntley.com/ralph/):

```bash
while :; do cat PROMPT.md | claude-code --dangerously-skip-permissions; done
```

That's it. [Geoffrey Huntley](https://ghuntley.com) created the technique and ran it to build entire programming languages. At a Y Combinator hackathon, a team used it to [ship 6 repos overnight](https://github.com/repomirrorhq/repomirror/blob/main/repomirror.md). No orchestrator, no tool registry, no safety layer; just a model in a loop, reading a prompt file, writing code, and looping back. Every time something went wrong, he tuned the prompt, ["like tuning a guitar."](https://www.theregister.com/2026/01/27/ralph_wiggum_claude_loops/) When the agent drifted too far, he'd `git reset --hard` and start again.

One key insight in Huntley's approach is that the feedback loop is everything. You want to program in ways where the agent can evaluate itself. This could be as simple as instructing it to add logging, or asking it to compile the application and inspect the output. The obsession with finding the perfect prompt is a trap - there is no perfect prompt.
Huntley also found that the agent has an inherent bias toward minimal and placeholder implementations. His solution was blunt:

> "DO NOT IMPLEMENT PLACEHOLDER OR SIMPLE IMPLEMENTATIONS. WE WANT FULL IMPLEMENTATIONS. DO IT OR I WILL YELL AT YOU."

For many tasks, this works: a while loop and a good prompt can take you surprisingly far.

But it also breaks in ways that are invisible until they're catastrophic. There's no context management: the model eventually drowns in its own output. There's no safety boundary; [`--dangerously-skip-permissions`](https://docs.anthropic.com/en/docs/claude-code/security) is right there in the flag name. There's no persistence: kill the process and your state is gone. There's no recovery: when the agent loops on the same bug for an hour, nobody notices.

The gap between that one-liner and what Codex, Cursor, or Claude Code actually ship is the entire subject of this post. **That gap is product engineering.**

## LLM ≠ Agent: The 7 Layers

An LLM is neither a coding agent nor a product. A coding agent product is a text generation model coupled with a **harness**, a runtime that repeatedly:

1. **Builds context:** Gathers relevant information across the project to align the LLM and increase the chances of generating useful output.
2. **Calls the model:** Runs the model, either in the cloud or locally. Today, the strongest models still live in the cloud (Opus, GPT-5.4, and other reasoners), but local models are getting close for many day-to-day tasks.
3. **Executes tool calls:** Models read code, execute code, use MCPs, and so on. Safety is important here.
4. **Persists everything:** Updates states, logs, and conversation history.
5. **Renders to human:** Shows results and receives new inputs from the user.
6. **Recovers from failures:** Handles errors, retries, and rollbacks.
7. **Loops back** to building context.

**OpenAI** uses the word "harness" for Codex's core agent loop and execution logic. In their architecture, the agent loop orchestrates interaction between the user, the model, and the tools - and the "App Server" exposes that harness to multiple clients (TUI, VS Code, desktop, partners) via a stable protocol.

**Anthropic** frames this slightly differently but arrives at the same place. Their ["Building Effective Agents"](https://www.anthropic.com/engineering/building-effective-agents) post describes the basic building block as an "augmented LLM" - a model enhanced with retrieval, tools, and memory. A product is an augmented LLM. The harness is what does the augmenting.

Here's how these layers break down into product architecture:

### Layer 1: Agent Loop

```
"System Prompt" → user → model → tools → model → ...
```

The conversation runs in turns. Because the agent can execute tool calls that modify the local environment, its "output" isn't limited to the assistant message - often the primary output is the code it writes or edits on your machine. But each turn always ends with an assistant message (like "I added the architecture.md you asked for"), which signals a termination state. From the agent's perspective, its work is complete and control returns to the user.

An agent could make hundreds of tool calls in a single turn, potentially exhausting the context window. **That makes context management one of the agent's core responsibilities, and in the current model landscape, probably the most important one.**

### Layer 2: Context Building

This layer figures out what data is available to better answer the user's request. For coding, that means which files are relevant, what's already been done, style conventions, and so on. During pre-training, models learn the common languages (Python, Rust, etc.); during context building, they learn your workspace conventions and schemas.

**[Context engineering is UX engineering](https://www.anthropic.com/engineering/building-effective-agents):** the product decides what the model sees and when. It's not just a capability question - it's a design question.

OpenAI learned this the hard way while building Codex. Their earliest lesson was simple: **give the agent a map, not a 1,000-page instruction manual.** They tried the "one big AGENTS.md" approach and it failed in predictable ways: a giant instruction file crowds out the task and the code, too much guidance turns into noise, it rots quickly, and it's hard to verify mechanically.

Their solution: **treat AGENTS.md as the table of contents**, not the encyclopedia. The repository's knowledge base lives in a structured `docs/` directory treated as the system of record. **A short AGENTS.md (roughly 100 lines) gets injected into context and serves primarily as a map, with pointers to deeper sources of truth elsewhere. From the agent's point of view, anything it can't access in-context while running effectively doesn't exist.**

> In practice, Anthropic models handle tool use and output formatting inside Cursor noticeably better than OpenAI models. Sonnet/Opus feel native, while OAI's models often blunder with Cursor's system prompts. This isn't a coincidence. [Cursor is Anthropic's largest customer](https://venturebeat.com/ai/anthropic-revenue-tied-to-two-customers-as-ai-pricing-war-threatens-margins), and along with GitHub Copilot, these two coding clients drive ~25% of Anthropic's revenue. When that much of your business depends on IDEs, your models end up optimized for them.

### Layer 3: Tooling Systems

The product needs a tool registry: which tools are available for the model to use. Each tool should define:

1. Argument schemas
2. Multi-modal support (images / videos)
3. Attachment / parameters

Example tools: shell, file edit, code search, browser automation, screenshot analysis.

Codex leans into a strong internal "tool orchestrator" model (approval, sandbox selection, execution pipeline). OpenCode leans into flexibility (dynamic tools/plugins, model-aware tool swapping).

### Layer 4: Safety

`sudo rm -rf /*`. Scary.

Harnesses today support:

1. Allowlist and denylist for tools and commands
2. Sandboxing
3. Snapshotting and recovery

Safety isn't "add a warning." It's architecture - approvals, policies, sandboxes, and undo. After all of that, you can't stop [users](https://x.com/Al_Grigor/status/2029889772181934425) from running dangerously.

### Layer 5: Replay / Persistence

Forking chats and environments is crucial for debugging. These systems are made of *turns*, tool calls, diffs, approvals, and other events, so you need to be able to restore them.

### Layer 6: Client Surface (TUI / Web / IDE)

Main players today:

- **TUI:** [OpenCode](https://github.com/anomalyco/opencode), [Claude Code](https://docs.anthropic.com/en/docs/claude-code), and [Codex](https://github.com/openai/codex)
- **IDE:** [Cursor](https://cursor.com), Google's [Antigravity](https://developers.googleblog.com/en/build-with-google-antigravity-our-new-agentic-development-platform/), and [Replit Agent](https://replit.com/products/agent), plus extensions like [GitHub Copilot](https://github.com/features/copilot)
- **Web:** [Bolt.new](https://bolt.new/), [v0](https://v0.app/), and [Lovable](https://www.lovable.dev/)

### Layer 7: Extensibility

[MCP](https://modelcontextprotocol.io), [Skills](https://docs.anthropic.com/en/docs/claude-code/skills), [`AGENTS.md`](https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/), all of the ecosystem around it. Anthropic excels here.
The ecosystem is converging on shared boundaries: MCP for tool connectivity, AGENTS.md for repo-specific instruction conventions, and Open Responses for provider-agnostic API shape.

## The LLM Provider Contract

Before diving into harness architecture, it's worth separating "model capability" from "product engineering." A reader should walk away knowing what to demand from any LLM provider - OpenAI, Anthropic, Google, and others.

### Streaming as Events, Not Just Text

For an agent, "streaming text" isn't enough. You need the model to tell you about tool calls *as they happen*, not after everything is done. This is what makes a coding agent feel responsive rather than frozen - and it's worth understanding concretely, because it's something you see every time you use your favorite coding agent.

When you ask Cursor to "read main.py and fix the bug," the model doesn't just generate text. Behind the scenes, it decides to call a tool (like `read_file`), generates the arguments for that tool (`{"path": "src/main.py"}`), and then the harness executes it. **All of this happens over a streaming connection using SSE (Server-Sent Events) - a web standard that lets a server push data to a client over a single long-lived HTTP connection.**

For the tool-call item itself, both Anthropic and OpenAI expose a similar three-phase streaming lifecycle:

**Phase 1 - "A tool call is starting."** The model has decided to call a tool. You get the tool name and a unique call ID immediately, before the arguments are fully generated. The UI can already show "Reading main.py..." while the model is still generating.

In the [**Anthropic Messages API**](https://docs.anthropic.com/en/api/messages), this is a `content_block_start` event with `type: "tool_use"`:

```json
{
  "type": "content_block_start",
  "index": 1,
  "content_block": { "type": "tool_use", "id": "toolu_01T1x...", "name": "read_file", "input": {} }
}
```

In the [**OpenAI Responses API**](https://platform.openai.com/docs/api-reference/responses), this begins with `response.output_item.added`, which emits an in-progress function call item.

**Phase 2 - "Arguments are streaming in."** The model generates the JSON arguments token by token: first `{"path": "src/m`, then `ain.py"}`. You see the arguments building up incrementally in the UI, which makes the whole interaction feel more responsive.

In **Anthropic**, these arrive as `content_block_delta` events with `type: "input_json_delta"`:

```json
{ "type": "content_block_delta", "index": 1, "delta": { "type": "input_json_delta", "partial_json": "{\"path\": \"src/m" } }
{ "type": "content_block_delta", "index": 1, "delta": { "type": "input_json_delta", "partial_json": "ain.py\"}" } }
```

In **OpenAI**, these are `response.function_call_arguments.delta` events:

```json
{ "type": "response.function_call_arguments.delta", "item_id": "fc_001", "delta": "{\"path\": \"src/m" }
```

**Phase 3 - "Done, execute it."** The tool call is fully formed. Arguments are finalized, the harness can now actually execute the tool.

In **Anthropic**: `content_block_stop`. In **OpenAI**: `response.function_call_arguments.done`, which also includes the complete arguments and function name in one payload.

(See [Anthropic's streaming docs](https://docs.anthropic.com/en/api/messages-streaming) and [OpenAI's streaming events reference](https://platform.openai.com/docs/api-reference/responses-streaming) for the full event schemas.)

**Why this matters for a harness:** Without these events, you'd have to wait for the entire model response to finish before you even know a tool call happened. With them, the product can show the user what's happening in real-time, start preparing the execution environment early (like spinning up a sandbox), and persist each event to the timeline for replay and debugging. Codex is built around consuming Responses API SSE streams and translating them into internal events for its own clients and surfaces.

Latency discipline matters here. To register as instantaneous to users, the rough target is about 100ms end-to-end, which aligns with classic HCI guidance for perceived immediacy. The same principle applies to the harness: the streaming contract should give the UI enough granularity that the user always understands what the agent is doing. Cursor does this well; Codex and Claude Code have room to improve here.

### Tool Calling with Stable IDs

In practice, robust agent harnesses benefit from tool calls that are addressable (call IDs), typed (schemas), and paired (every call has an output). Systems like Codex additionally persist enough thread state and event history to reconstruct turns and resume sessions.

### Multi-Turn Thread State

Agents aren't "one request." They're threads that grow until they hit a context window, then require compaction or truncation strategies. This is one of the ways each coding agent product differs. For instance, Claude Code suggests cleaning the context after plan mode. Context management is still one of the biggest issues that defines a good harness - context rot is a common problem, and larger windows (today mostly up to 1M tokens) increase your costs.

As OpenAI puts it: "generally, the cost of sampling the model dominates the cost of network traffic, making sampling the primary target of our efficiency efforts. This is why prompt caching is so important."

### Portability

Codex explicitly notes its endpoint is configurable and can work with any endpoint implementing the Responses API. This leads naturally to vendor-neutral standards like Open Responses (launched in January 2026), which defines items, semantic streaming, and tool invocation patterns for provider-agnostic agent APIs.

## Harness Deep Dive: Codex vs OpenCode

| Layer / Dimension | [Codex CLI (Rust)](https://github.com/openai/codex) | [OpenCode (TS/Bun)](https://github.com/anomalyco/opencode) |
| --- | --- | --- |
| **Layer 1: Agent Loop (Architecture)** | Single-process CLI/TUI runtime multiplexing input, thread events, and ticks via internal channels | Client-server architecture with `/event` SSE and clients subscribing to SDK events |
| **Layer 2: Context Building (Prompting)** | Default base instructions compiled into the binary, plus model-specific instruction files and personality/model-message overlays | Runtime-selected provider prompts via model-ID matching, plus runtime environment and instruction-file injection |
| **Layer 3: Tooling Systems** | Compiled built-ins plus centrally routed MCP/runtime tools through a central orchestrator pipeline | Dynamic registry + model-aware tool swapping + plugins/custom tools |
| **Layer 4: Safety** | Exec policy + approvals enforced by orchestrator + OS sandboxing (defense-in-depth) | Permission broker + AST parsing for bash command analysis (policy-first) |
| **Layer 5: Replay / Persistence** | Internal event channels and thread state make turns reconstructable inside one runtime | SSE event backbone and server-owned state make replay and multi-client synchronization natural |
| **Layer 6: Client Surface (UX)** | Fast terminal-native loop (Rust TUI patterns) | Terminal rendered like a web app (JSX/components), toasts/routing/events |
| **Layer 7: Extensibility** | MCP treated as a runtime component (namespaced tools, runtime discovery) | Plugins + custom tools are first-class; providers/auth are pluggable |

<img src="./img3.jpeg" alt="Codex vs OpenCode harness comparison" style="max-height: 300px;"/>

### Harness Layer 1: Agent Loop (Monolith vs Control-Plane)

At this layer, "monolith vs control-plane" is really the question of where the agent loop lives and who owns its state.

**Codex: "one binary owns everything."** Codex's TUI *is* the app runtime: it multiplexes user input, internal agent events, and background ticks inside a single [Tokio](https://tokio.rs) loop.

```text
[TUI Process]
  ├─ input (keys)
  ├─ agent events (thread rx)
  ├─ periodic ticks
  └─ tool execution / approvals / rendering
```

The event loop in Rust:

```rust
loop {
    tokio::select! {
        // 1) Internal app/UI commands
        Some(app_event) = app_event_rx.recv() => {
            control = app.handle_event(tui, app_event).await?;
        }
        // 2) Messages from the active Codex thread
        Some(thread_event) = active_thread_rx.recv(),
            if active_thread_rx_enabled => {
            app.handle_active_thread_event(tui, thread_event).await?;
            control = Continue;
        }
        // 3) Terminal input + draw ticks
        Some(tui_event) = tui_events.next() => {
            control = app.handle_tui_event(tui, tui_event).await?;
        }
        // 4) New agent threads (multi-agent/collab)
        created = thread_created_rx.recv(),
            if listen_for_threads => {
            if let Ok(thread_id) = created {
                app.handle_thread_created(thread_id).await?;
            }
            control = Continue;
        }
    }
    if matches!(control, Exit(reason)) { break reason; }
}
```

[Source: codex-rs/tui/src/app.rs](https://github.com/openai/codex/blob/6638558b8807328e852b54580b010be7034699b7/codex-rs/tui/src/app.rs#L1827)

Why it's a product choice: low latency, minimal moving parts, "what you see is what runs." This architecture assumes one UI owns the agent. If you want multiple clients (TUI + web), you need an RPC layer to multiplex control and broadcast updates. The monolith wins when latency matters, you want a single owner of state and lifecycle, and you want a self-contained artifact.

**OpenCode** explicitly has a server that streams events, and a TUI client that subscribes and reacts:

```text
[TUI client]   [Web client]   [Scripts]
       \            |            /
        --> [Server /event SSE + APIs] --> tools/models/state
```

The server [SSE](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events) endpoint:

```typescript
.get(
  "/event",
  describeRoute({ operationId: "event.subscribe" }),
  async (c) => { ... }
)
```

[Source: opencode/src/server/server.ts](https://github.com/anomalyco/opencode/blob/6c7d968c4423a0cd6c85099c9377a6066313fa0a/packages/opencode/src/server/server.ts#L503)

The TUI subscribes to events reactively:

```typescript
sdk.event.on(TuiEvent.CommandExecute.type, (evt) => {
    command.trigger(evt.properties.command)
})
sdk.event.on(TuiEvent.ToastShow.type, (evt) => {
    toast.show({
        title: evt.properties.title,
        message: evt.properties.message,
        variant: evt.properties.variant,
        duration: evt.properties.duration,
    })
})
```

[Source: opencode/src/cli/cmd/tui/app.tsx](https://github.com/anomalyco/opencode/blob/6c7d968c4423a0cd6c85099c9377a6066313fa0a/packages/opencode/src/cli/cmd/tui/app.tsx#L676)

If Codex is more like a secure, single-process instrument panel (one engine, one cockpit), OpenCode is more like a control plane: a server that emits events, and any number of clients that can render them.

**What each architecture makes harder:** The monolith makes multi-client attach and remote orchestration require an RPC-ish boundary. The control-plane introduces versioning, consistency, reconnect, and "who is the source of truth?" bugs.

### Harness Layer 2: Context Building (Prompting)

If you stare at these projects long enough, you stop thinking of "the system prompt" as text and start treating it like product architecture. Prompts don't just influence what the model says - they decide what the model believes it is, what it believes it can do, how consistent the product is across models, and how reproducible the agent is.

**Codex: compiled contract.** Codex treats prompts like a versioned, auditable contract that ships with the binary. Default base instructions are embedded at compile time via `include_str!`, then composed with model-specific instructions and, for some configurations, personality templates. *Codex effectively has prompt families: a base prompt, generic model prompts, codex-tuned model prompts, and orthogonal personality templates injected into a template.*

This is not just a naming detail; it's an architectural choice: behavior is much more tightly tied to releases than in a purely runtime-selected system. Switching models in Codex changes a narrow slice of the instruction surface while the harness contract stays coherent, even though runtime overrides still exist.

**OpenCode: runtime routing.** OpenCode selects prompt fragments at runtime using model-ID string matching. This is intentionally lightweight, but also easier to break: model IDs are treated as truth, the matching logic relies on substrings rather than a canonical model registry lookup, and the fallback naming is easy to misread - which makes prompt behavior harder to predict.

OpenCode also injects environment state into the prompt, including `Today's date: ${new Date().toDateString()}`. That one line is a big deal: it makes the prompt bytes time-dependent. Great for grounding, bad for reproducibility.

**Tool descriptions are prompts too.** OpenCode leans into this harder - its `bash.txt` does workflow steering that isn't about Bash at all; it gives the model instructions about how to behave. This is a design choice: "how to behave" lives close to the tool, not only in the global system prompt. If behavior lives in tool descriptions, the global prompt can be smaller, but each tool description becomes something you need to review carefully. If behavior lives in the global prompt, tool descriptions stay tight, but the base prompt becomes a larger contract to maintain.

### Harness Layer 3: Tooling Systems

**Codex** is built around compiled tool handlers plus centrally routed runtime tools, all routed through a central "run tool" pipeline:

```rust
pub trait ToolHandler: Send + Sync {
    fn kind(&self) -> ToolKind;
    fn name(&self) -> ToolName;
    async fn handle(&self, /* ... */) -> ToolResult;
}
```

[Source: codex-rs/core/src/tools/registry.rs](https://github.com/openai/codex/blob/6638558b8807328e852b54580b010be7034699b7/codex-rs/core/src/tools/registry.rs#L22-L43)

The orchestrator is the single control point - one place where policy gets enforced for every tool call:

```rust
pub async fn run(
    &mut self,
    tool: &mut T,
    req: &Rq,
    tool_ctx: &ToolCtx<'_>,
    turn_ctx: &TurnContext,
    approval_policy: AskForApproval,
) -> Result<Out, ToolError>
```

[Source: codex-rs/core/src/tools/orchestrator.rs](https://github.com/openai/codex/blob/6638558b8807328e852b54580b010be7034699b7/codex-rs/core/src/tools/orchestrator.rs#L35-L42)

What this buys you: fewer ways for behavior to differ across models and providers, because tools are compiled, typed, and centrally routed.

**OpenCode's** registry is intentionally composable at runtime:

```typescript
// Model-aware tool swapping
const usePatch =
    model.modelID.includes("gpt-") &&
    !model.modelID.includes("oss") &&
    !model.modelID.includes("gpt-4")

// Load tools dynamically from config dirs
const glob = new Bun.Glob("{tool,tools}/*.{js,ts}")
for (const match of glob.scanSync(/* ... */)) {
    const mod = await import(match)
}

// Inject plugin tools into the registry
const plugins = await Plugin.list()
for (const plugin of plugins) {
    for (const [id, def] of Object.entries(plugin.tool ?? {})) {
        custom.push(fromPlugin(id, def))
    }
}
```

[Source: packages/opencode/src/tool/registry.ts](https://github.com/anomalyco/opencode/blob/6c7d968c4423a0cd6c85099c9377a6066313fa0a/packages/opencode/src/tool/registry.ts)

What this buys you: faster tool and plugin iteration - new tools and providers without forking core, and the ability to "ship behavior" as plugins. The trade-off: auditing is harder. Runtime composition means "what tools exist?" becomes configuration-dependent, which could also be a point of entry for malicious code.

### Harness Layer 4: Safety

**Codex's** safety approach: tools execute through an orchestrated pipeline that can require approvals and apply sandbox constraints. Execution funnels through `ToolOrchestrator::run(...)` and takes explicit approval policy as an input.

**OpenCode's** safety approach, at least in the bash path, is: understand what the command is, then run it if permissions allow. The bash tool parses commands with [tree-sitter](https://tree-sitter.github.io/tree-sitter/):

```typescript
const tree = await parser().then((p) => p.parse(params.command))
for (const node of tree.rootNode.descendantsOfType("command")) {
    // extract command + args
}

// Permission checks before spawn
if (directories.size > 0) {
    await ctx.ask({ permission: "external_directory", /* ... */ })
}
if (patterns.size > 0) {
    await ctx.ask({ permission: "bash", /* ... */ })
}
```

[Source: packages/opencode/src/tool/bash.ts](https://github.com/anomalyco/opencode/blob/6c7d968c4423a0cd6c85099c9377a6066313fa0a/packages/opencode/src/tool/bash.ts#L84-L164)

But it's a trade-off: in the cited OpenCode bash path, approval becomes the main guardrail, while Codex invests more heavily in execution containment.

### Harness Layer 5: Replay / Persistence

Long-running agents are event systems, not just chat transcripts. You need to be able to reconstruct what happened: turns, tool calls, approvals, outputs, and the order they occurred in.

**Codex** keeps this close to the runtime. The same internal event channels that drive the app loop and active thread updates also make the session legible after the fact: tool calls, thread events, and UI state transitions all pass through a single process with a single owner of state.

**OpenCode** pushes persistence outward into the control plane. Its SSE event backbone and server-owned state make replay, connecting from another client, and multi-client synchronization more natural, because the system is already designed around publishing and subscribing to structured events.

The trade-off matches the architecture split. Codex makes local state easier to reason about because fewer components are involved. OpenCode makes distributed replay more straightforward because event distribution is already a first-class concept.

### Harness Layer 6: Client Surface (UX)

**Codex** reads like a high-performance terminal program: one async loop, explicit rendering and event handling, minimal indirection. This produces fast responsiveness and fewer "UI framework" failure modes, but less discoverability unless you build command palettes, routing, and rich toasts manually.

**OpenCode's** TUI is composed like a web app:

```typescript
render(() => (
  <ErrorBoundary>
    <ArgsProvider>
      <ExitProvider>
        <KVProvider>
          <ToastProvider>
            <RouteProvider>
              <TuiConfigProvider>
                <SDKProvider>
                  <App />
```

Because it's a client, it subscribes to the world via SDK events. OpenCode optimizes for surface area and discoverability (routing, dialogs, toasts, remote control); Codex optimizes for tight feedback loops and minimal architecture.

### Harness Layer 7: Extensibility

**Codex** treats MCP as a runtime-integrated tool source - namespaced tool kinds, routed through the same handler model.

**OpenCode's** registry literally merges plugin-defined tools into the tool list. That's not "MCP-only" - it's "anything can be a tool if it implements the hook surface." Auth flows, tools, request/response shaping - all pluggable.

Product implication: OpenCode is clearly designed to be more platform-like and hackable. Codex is designed to remain a tight, tightly controlled harness and lets MCP expand its reach without turning the core into a general plugin system.

### The Bottom Line

Neither approach is "better" in the abstract. They're different answers to the same question: *"How do you turn a text generation model into a product that can safely act on its own?"*

- **Codex answers:** contain execution (orchestrator + approvals + sandbox).
- **OpenCode answers:** favor runtime composition and, in its bash path, pre-execution understanding (AST parsing + permission broker + composable tooling), and more.

## Scaling the Harness: The C Compiler Case Study

Anthropic published a [case study](https://www.anthropic.com/engineering/building-c-compiler) about building a C compiler with a team of parallel Claude agents. It's the best public example of what harness engineering looks like at scale.

The architecture was simple: each Docker container mounted a shared bare git repo at `/upstream`, cloned a local workspace, and coordinated through lock files in `current_tasks/` - pick a task by creating a lock file, do the work, pull, merge, push, remove the lock. Simple git-based synchronization enabled parallelization without complex orchestration.

```bash
#!/bin/bash
while true; do
    COMMIT=$(git rev-parse --short=6 HEAD)
    LOGFILE="agent_logs/agent_${COMMIT}.log"
    claude --dangerously-skip-permissions \
           -p "$(cat AGENT_PROMPT.md)" \
           --model claude-opus-4-6-20260131 &> "$LOGFILE"
done
```

**What they learned about harness design:** Continuous task loops beat interactive sessions - the agent needs to immediately pick up the next task without waiting for human input. High-quality test harnesses are critical because the tests define what the agent solves. Tests should print minimal output and log details to files - context window rotting is a real problem. They added `--fast` modes that run deterministic subsamples so agents don't spend hours on full test runs. And extensive READMEs and progress files are essential since each fresh container starts with zero context.

**Parallelization worked great with independent failing tests**, but monolithic tasks caused all agents to hit the same bugs. The solution was to use GCC as a known-good oracle to narrow the failure-inducing file subsets, letting different agents make progress on different bugs. They also used agent specialization - dedicated agents for code consolidation, performance optimization, documentation, and design critique.

**Hard limits:** Code quality degrades as complexity grows - new features frequently broke existing functionality even with CI. Generated code efficiency was poor (worse than `gcc -O0`). The total cost was just under $20k for roughly 100k lines, which is cost-effective vs. human teams, but passing tests still doesn't guarantee quality without human verification.

OpenAI puts the lesson well in its [harness engineering post](https://openai.com/index/harness-engineering/): "When something failed, the fix was almost never 'try harder.' Human engineers always stepped into the task and asked: 'what capability is missing, and how do we make it both legible and enforceable for the agent?'"

## The Future

The direction is clear: agentic systems that run longer, at scale, with less supervision. But the interesting frontier isn't just "more agent" - it's specialization and infrastructure. Think multi-hour autonomous tasks, performance-critical niches that general-purpose agents still can't touch, and better context management, model routing, and cost control. The bottleneck is shifting from "can the model code?" to "can we run it reliably, cheaply, and at scale?"

Building software still demands discipline - it just shows up more in the scaffolding than in the code. **Humans steer. Agents execute.** The question is whether we can build harnesses that let them do it reliably.

## What's Left is Your Judgment and Taste

Coding, a skill I've been mastering for years, is becoming a commodity. I can now replicate meaningful parts of someone's years-long sub-domain expertise in a few days with enough token budget. No one should care anymore whether you remember specific syntax or can grind LeetCode (though it's still a decent proxy for how someone thinks). The fundamentals matter more now, not less - the models execute the heavy lifting; you need to know what to ask for and whether the output is right. What's left is your judgment and taste.

The real shift isn't about speed on individual tasks. It's about navigating between projects, understanding context, and shipping fast and reliably. The harness patterns in this post - context building, safety, persistence, extensibility - are product engineering decisions that require exactly the kind of judgment no token budget can replace.
The hard part is no longer writing the code, but deciding what code should exist.

<img src="./img2.jpeg" alt="eye with reflection of a terminal" style="max-height: 400px;" />

## References

1. Unrolling the Codex agent loop
   <https://openai.com/index/unrolling-the-codex-agent-loop/>
2. Harness engineering: leveraging Codex in an agent-first world
   <https://openai.com/index/harness-engineering/>
3. Building effective agents
   <https://www.anthropic.com/engineering/building-effective-agents>
4. Open Responses
   <https://www.openresponses.org/>
5. How to write a great agents.md: Lessons from over 2,500 repositories
   <https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/>
6. Ralph Wiggum as a "software engineer"
   <https://ghuntley.com/ralph/>
7. Building a C compiler with a team of parallel Claudes
   <https://www.anthropic.com/engineering/building-c-compiler>
8. Scaling long-running autonomous coding
   <https://cursor.com/blog/scaling-agents>
9. Streaming Messages
   <https://docs.anthropic.com/en/api/messages-streaming>
10. OpenAI Responses API Reference
    <https://platform.openai.com/docs/api-reference/responses-streaming>
11. Unlocking the Codex harness: how we built the App Server
    <https://openai.com/index/unlocking-the-codex-harness/>
12. Vibe engineering
    <https://simonwillison.net/2025/Oct/7/vibe-engineering/>
13. How I Use Claude Code
    <https://boristane.com/blog/how-i-use-claude-code/>
14. Just Talk To It - the no-bs Way of Agentic Engineering
    <https://steipete.me/posts/just-talk-to-it>
