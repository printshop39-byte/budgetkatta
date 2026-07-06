# 09 · Financial Knowledge Graph (Moat M3)

> Money is not independent rows — it is a **connected system**. Modeling it as a graph of typed relationships lets the AI *reason causally* instead of merely reporting. The graph is the brain the agents (F19) and the Health Score (F3) both think with.

## Why a graph, not a table
A table says: *"emergency fund = ₹40,000, loan EMI = ₹18,000."*
A graph says: *"your emergency fund only covers 0.8 months, and this new loan's EMI raises your fixed obligations to 55% of income — **so this loan makes you fragile**."*
The difference is **causal reasoning**, and it's what makes the CFO feel like a CFO.

## Node types (financial entities)
| Node | Holds |
|------|-------|
| `Income` | sources, monthly amount, stability |
| `Expense` | essential vs discretionary |
| `Savings` | liquid buckets (bank, FD, RD) |
| `EmergencyFund` | derived: months of runway |
| `Insurance` | life, health — cover vs adequacy |
| `Loan` | principal, EMI, rate, tenure |
| `Investment` | SIP, MF, EPF, stocks |
| `Goal` | target, horizon, funding source |
| `LifeEvent` | marriage, baby, home… (from F11) |
| `Product` | FD/loan/insurance/fund (from reference data + Regional Intelligence) |

Nodes are **per-user**, derived from `FinancialProfile` + `MemoryFact` (F12), refreshed on every data change.

## Edge types (typed relationships)
| Edge | Meaning | Example |
|------|---------|---------|
| `funds` | A pays into B | Income → Savings → EmergencyFund |
| `protects` | A shields B from shock | Insurance → Family / Income |
| `blocks` | A weakens/threatens B | Loan → SavingsRate; HighEMI → GoalProgress |
| `enables` | A is a prerequisite for B | EmergencyFund → (safely) Investment |
| `requires` | B needs A before it's wise | Home purchase → down-payment Goal |
| `progresses` | contribution advances B | SIP → RetirementGoal |
| `recommends` | graph gap → product (disclosed) | LowEmergencyFund → high-yield FD |

## How the graph powers the product
- **Health Score (F3):** each pillar is a **graph query**, not an isolated formula — e.g. the "debt" pillar reads all `Loan.blocks` edges against `Income`. The score becomes explainable *by the graph path* ("here's the chain that cost you points").
- **Life Events (F11):** each event injects the nodes/edges its playbook implies (Baby → `requires` health-cover top-up, `requires` child-education Goal).
- **Recommendations (F9):** only fire on a **real graph gap** (a missing/weak edge), which is why they're contextual, not spammy.
- **Agents (F19):** every agent reads the same graph, so the Loan Agent *knows* what the Insurance Agent knows — shared reasoning substrate.
- **Reports (F8):** the monthly narrative walks the graph ("what changed in your money system this month").

## Implementation (pragmatic, not over-engineered)
- **v1: an in-app derived graph, not a separate graph DB.** Build `lib/knowledgeGraph.ts` that projects the user's profile+memory into an in-memory node/edge object per request (Mongo stays the store of record). This ships fast and is enough for reasoning at single-user scale.
- **Deterministic edges** from rules (funds/blocks/enables/requires are computed, testable) — the graph stays explainable and auditable (YMYL-safe).
- **Grounding for AI:** the compact graph (nodes + salient edges + gaps) is serialized into the context passed to agents/narration — so AI reasons over structure, never invents it.
- **Later (Platform phase):** if scale/relationship depth demands it, migrate to a real graph store (Neo4j / Mongo `$graphLookup`) — the `lib/knowledgeGraph.ts` interface isolates that choice.

## Testing
- Golden graphs for fixture profiles; assert expected edges (e.g. thin-emergency-fund profile has a `blocks` edge from `Loan` and the Score reflects it).
- Property: adding savings never creates a `blocks` edge; the graph is monotonic in the obvious directions.

## Why this is a moat (M3)
Any competitor can compute a score. Very few will model a user's **entire money life as a reasoning graph tied to regional products and a decade of memory** — and none can retro-fit the *history* of how that graph evolved. The graph × memory × regional-product binding is the defensibility.
