# 10 · Multi-Agent AI System (Moat M4)

> Not one chatbot — an **orchestra**. The **AI CFO** is the conductor; specialist agents each own a financial domain, share the Memory (F12) and Knowledge Graph (§09), and hand off to each other. One assistant is cloneable; a coordinated fleet with shared memory + a regional graph is not.

## Architecture
```
                       ┌─────────────────────────────┐
   user ───────────────►      AI CFO (Orchestrator)   │  routes intent, plans,
                       │  - reads Memory + Graph       │  sequences agents,
                       │  - decides which agent(s)     │  reconciles answers
                       └──────────────┬────────────────┘
        ┌───────────┬──────────┬──────┼──────┬──────────┬───────────┐
        ▼           ▼          ▼      ▼      ▼          ▼           ▼
   ┌────────┐ ┌────────┐ ┌────────┐ ┌────┐ ┌────────┐ ┌────────┐ ┌────────┐
   │  Tax   │ │  Loan  │ │Insuran-│ │Inve│ │  Goal  │ │Retire- │ │Document│
   │ Agent  │ │ Agent  │ │ce Agent│ │st. │ │ Agent  │ │ment Ag.│ │ Agent  │
   └────┬───┘ └────┬───┘ └────┬───┘ └─┬──┘ └────┬───┘ └────┬───┘ └────┬───┘
        └──────────┴──────────┴───────┴─────────┴──────────┴──────────┘
                        shared: Memory (F12) · Knowledge Graph (§09) ·
                        AI Actions toolset (F14) · Regional Intelligence (M2)
```

## The agents (each = domain scope + tools + guardrails)
| Agent | Owns | Reads | Can propose (via F14, confirm-before-mutate) |
|-------|------|-------|-----------------------------------------------|
| **Tax** | 80C/deductions, ITR timing, advance tax | income, investments, insurance | reminders, education, CA handoff (F17) |
| **Loan** | EMI health, prepayment, balance transfer | loans, income, graph `blocks` edges | `findBetterFD`-style compare, refinance rec |
| **Insurance** | life/health adequacy, renewals | insurance nodes, dependents, life events | `comparePolicy`, renewal reminder |
| **Investment** | SIP/goal funding, allocation *(educational)* | investments, goals, risk | `suggestSIP` (categories, not securities) |
| **Goal** | goal creation, on-track tracking | goals, savings rate | `createGoal`, contribution nudge |
| **Retirement** | long-horizon corpus, EPF/NPS | investments, age, income | projection, education |
| **Document** | vault summaries → facts | documents (F7) | extract → `updateMemory` |

## Orchestration flow
1. **Intent + context assembly:** orchestrator reads the user message, pulls the relevant slice of Memory + Knowledge Graph.
2. **Routing:** picks one or more agents (a "should I prepay my loan or start a SIP?" question fans out to Loan + Investment + Goal).
3. **Agent reasoning:** each agent reasons over the shared graph within its domain, using its tools.
4. **Reconciliation:** orchestrator merges agent outputs into one coherent CFO answer (resolves conflicts, ranks by the user's actual graph gaps).
5. **Action proposal:** any mutating step (reminder, goal, memory write) is surfaced for **explicit user confirmation** and logged to `ActionLog` (F14).
6. **Memory write-back:** salient new facts and the decision are written to Memory → the fleet is smarter next time.

## Guardrails (non-negotiable)
- **Bounded, allow-listed tools only** — no open-ended tool creation on financial data.
- **SEBI/IRDAI boundary holds across every agent:** informational + execution-only. The Investment/Retirement agents discuss *categories and math*, never "buy security X"; personalized advice triggers a **human advisor handoff** (F17), not an agent overstep.
- **Confirm-before-mutate**, Zod-validated inputs, per-user rate/spend caps, full `ActionLog` audit.
- **Grounded only:** agents reason over Memory + Graph passed as context; they don't invent user data. Minimal PII per LLM call.
- **Fallback:** if the LLM/orchestration fails, degrade to the existing rule-based responses (pattern already in `lib/gemini.ts`).

## Implementation path (don't build all seven at once)
- **Engagement phase:** ship the **Orchestrator + 2–3 agents** (Goal, Insurance, Loan) — the highest-frequency needs. Reuse `lib/gemini.ts` function-calling; each agent is a system-prompt + tool subset + graph query, not a separate service.
- **Marketplace phase:** add Tax + Investment + Retirement + Document; wire the advisor handoff.
- **Platform phase:** agents become composable/extensible; expose select capabilities via API (B2B).
- Keep it **modular**: `lib/agents/<name>.ts` with a shared contract `(ctx: {memory, graph, tools}) => AgentReply`. The orchestrator is `lib/agents/orchestrator.ts`.

## Why this is a moat (M4)
The intelligence isn't the model (rented, commoditized) — it's the **coordination of specialist agents over a user's decade-long memory and a Maharashtra-specific knowledge graph.** That combination is architecturally hard, data-dependent, and trust-dependent — the three things capital alone can't buy quickly.
