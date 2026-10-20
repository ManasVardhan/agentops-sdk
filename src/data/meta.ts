// Hand-written copy for each package. Every API, command and feature below is
// taken from the package README at the commit that matches the PyPI release.

export type StageId = "build" | "benchmark" | "guard" | "observe" | "cost"

export type Snippet = { label: string; lang: "bash" | "python"; code: string }

export type PackageMeta = {
  name: string
  importName?: string
  cli?: string
  stage: StageId
  icon: "forge" | "diff" | "bench" | "shield" | "replay" | "siren" | "wallet"
  headline: string
  features: string[]
  snippets: Snippet[]
  extrasInfo?: Record<string, string>
}

export const STAGES: { id: StageId; label: string; verb: string; blurb: string }[] = [
  {
    id: "build",
    label: "Build",
    verb: "Scaffold tools, version prompts",
    blurb: "Generate MCP servers with tests built in, and track every prompt revision like code.",
  },
  {
    id: "benchmark",
    label: "Benchmark",
    verb: "Choose the model with numbers",
    blurb: "Measure TTFT, throughput, latency percentiles, cost and quality before you commit.",
  },
  {
    id: "guard",
    label: "Guard",
    verb: "Wrap every call in guardrails",
    blurb: "Redact PII, block prompt injection and validate output on the way in and out.",
  },
  {
    id: "observe",
    label: "Run & Observe",
    verb: "Trace runs, catch failures",
    blurb: "Record and replay agent traces, and classify production failures by root cause.",
  },
  {
    id: "cost",
    label: "Control cost",
    verb: "Budget every token",
    blurb: "Track spend per call and enforce hard caps before a runaway loop burns the budget.",
  },
]

// Order here is the lifecycle order and also fixes each package's chart color slot.
export const META: PackageMeta[] = [
  {
    name: "mcp-server-forge",
    cli: "mcp-forge",
    stage: "build",
    icon: "forge",
    headline: "One command generates a complete, runnable MCP server project.",
    features: [
      "Scaffold full MCP server projects from templates",
      "Built-in test harness speaking JSON-RPC over stdio",
      "Validate compliance against the MCP specification",
      "Dockerfile in every project, publish to PyPI in one command",
    ],
    snippets: [
      {
        label: "CLI",
        lang: "bash",
        code: `pip install mcp-server-forge

# Scaffold a server with two tools
mcp-forge new my-server --tools weather,calculator

# Exercise it over real stdio
cd my-server
pip install -e .
mcp-forge test --cmd 'python -m my_server.server'`,
      },
    ],
    extrasInfo: { publish: "build and twine for publishing to PyPI" },
  },
  {
    name: "llm-promptdiff",
    importName: "promptdiff",
    cli: "promptdiff",
    stage: "build",
    icon: "diff",
    headline: "Prompts are code. Version, diff and changelog them like it.",
    features: [
      "Store every prompt version with messages and metadata",
      "Line-level diffs with similarity scores",
      "Tags, a registry, and auto-generated changelogs",
      "Evaluate prompt versions against test cases",
    ],
    snippets: [
      {
        label: "CLI",
        lang: "bash",
        code: `pip install llm-promptdiff

promptdiff init
echo "Summarize this text: {text}" | promptdiff add summarizer -m "Initial version"
echo "You are an expert summarizer. Summarize the text below in 2 sentences." \\
  | promptdiff add summarizer -m "Added role and structure"

# See what changed
promptdiff diff summarizer 1 2
promptdiff log summarizer`,
      },
      {
        label: "Python",
        lang: "python",
        code: `from promptdiff import PromptStore, PromptDiff

store = PromptStore(".")
store.init()

store.add("my-prompt", "Hello {name}", message="v1")
store.add("my-prompt", "Hi there, {name}!", message="More friendly")

differ = PromptDiff()
v1 = store.get_version("my-prompt", 1)
v2 = store.get_version("my-prompt", 2)
result = differ.full_diff(v1.content, v2.content, 1, 2)
print(f"Similarity: {result.similarity_ratio:.1%}")`,
      },
    ],
    extrasInfo: { embeddings: "optional OpenAI embeddings for similarity scoring" },
  },
  {
    name: "bench-my-llm",
    cli: "bench-my-llm",
    stage: "benchmark",
    icon: "bench",
    headline: "Stop guessing which model is faster. Measure it.",
    features: [
      "TTFT, tokens per second and p50 / p95 / p99 latency",
      "Cost estimation and quality scoring against references",
      "Side-by-side model comparison with winner highlights",
      "Any OpenAI-compatible API: OpenAI, Ollama, vLLM, Together",
    ],
    snippets: [
      {
        label: "CLI",
        lang: "bash",
        code: `pip install bench-my-llm

# Benchmark one model on a built-in suite
bench-my-llm run --model gpt-4o --suite reasoning

# Head-to-head comparison
bench-my-llm compare gpt-4o gpt-4o-mini --suite reasoning`,
      },
    ],
    extrasInfo: { yaml: "load custom prompt suites from YAML files" },
  },
  {
    name: "llm-shelter",
    importName: "llm_shelter",
    stage: "guard",
    icon: "shield",
    headline: "Ship LLM apps without shipping your users' data.",
    features: [
      "PII redaction: emails, phones, SSNs, cards, IPs, AWS keys",
      "Prompt injection detection, including delimiter and encoding tricks",
      "Toxicity filtering, length limits and JSON schema validation",
      "FastAPI middleware plus @guard_input / @guard_output decorators",
    ],
    snippets: [
      {
        label: "Python",
        lang: "python",
        code: `from llm_shelter import GuardrailPipeline, PIIValidator, InjectionValidator
from llm_shelter.pipeline import Action

pipeline = (
    GuardrailPipeline()
    .add(PIIValidator(redact=True), Action.REDACT)
    .add(InjectionValidator(), Action.BLOCK)
)

result = pipeline.run("My email is alice@company.com, help me out")
print(result.text)  # "My email is [EMAIL_REDACTED], help me out"`,
      },
    ],
    extrasInfo: {
      cli: "the command line scanner",
      fastapi: "drop-in ASGI middleware",
      all: "every optional integration",
    },
  },
  {
    name: "agent-trace-replay",
    importName: "agent_replay",
    cli: "agent-replay",
    stage: "observe",
    icon: "replay",
    headline: "Agents are black boxes. Record every step and replay it.",
    features: [
      "Record LLM calls, tool use and decisions with a context manager",
      "Replay traces step by step in the terminal",
      "Diff two runs to find exactly where behavior diverged",
      "Tree view and a self-contained HTML timeline export",
    ],
    snippets: [
      {
        label: "Python",
        lang: "python",
        code: `from agent_replay import Recorder

with Recorder("my-agent", output_path="trace.jsonl") as rec:
    with rec.span("planning"):
        rec.llm_request(model="gpt-4", messages=[{"role": "user", "content": "Hello"}])
        rec.llm_response(content="Hi there!", tokens=5)
    with rec.span("tool-use"):
        rec.tool_call("search", {"query": "python docs"})
        rec.tool_result("search", {"url": "https://docs.python.org"})`,
      },
      {
        label: "CLI",
        lang: "bash",
        code: `pip install agent-trace-replay

agent-replay show trace.jsonl
agent-replay show trace.jsonl --tree
agent-replay replay trace.jsonl`,
      },
    ],
  },
  {
    name: "ai-agent-sentry",
    importName: "agent_sentry",
    cli: "agent-sentry",
    stage: "observe",
    icon: "siren",
    headline: "Crash reporting for AI agents. Catch failures before your users do.",
    features: [
      "One @watch decorator wraps any agent function",
      "Root causes classified: timeout, hallucination, context overflow, rate limit",
      "Streamlit dashboard with failure rates and reliability scores",
      "Alerts via Slack, webhooks, email or custom callbacks",
    ],
    snippets: [
      {
        label: "Python",
        lang: "python",
        code: `# pip install ai-agent-sentry, then import it as agent_sentry
from agent_sentry import watch

@watch
def my_agent(query):
    result = call_llm(query)
    return result

# Every call is now tracked. Every failure is caught.
my_agent("summarize this document")`,
      },
      {
        label: "Dashboard",
        lang: "bash",
        code: `pip install "ai-agent-sentry[dashboard]"
agent-sentry dashboard`,
      },
    ],
    extrasInfo: {
      openai: "OpenAI client wrapper",
      anthropic: "Anthropic client wrapper",
      langchain: "LangChain callback handler",
      dashboard: "the Streamlit dashboard",
      all: "every optional integration",
    },
  },
  {
    name: "llm-cost-guardian",
    importName: "llm_cost_guardian",
    cli: "llm-cost-guardian",
    stage: "cost",
    icon: "wallet",
    headline: "Real-time cost tracking and budget enforcement for LLM API calls.",
    features: [
      "Per-call cost calculated from token usage",
      "Hard caps, soft warnings and sliding window budgets",
      "Drop-in wrappers for OpenAI and Anthropic clients",
      "Prometheus, JSON and CSV export, plus a CLI",
    ],
    snippets: [
      {
        label: "Python",
        lang: "python",
        code: `from llm_cost_guardian import CostTracker, HardCapPolicy, BudgetManager

tracker = CostTracker()
budget = BudgetManager().add(HardCapPolicy(limit_usd=5.00))

# Track a call (or use the wrapper for automatic tracking)
tracker.record("gpt-4o", input_tokens=1500, output_tokens=800)
budget.enforce(tracker)  # raises BudgetError if over limit

print(f"Cost so far: \${tracker.total_cost:.4f}")`,
      },
      {
        label: "Wrapper",
        lang: "python",
        code: `from openai import OpenAI
from llm_cost_guardian import CostTracker, TrackedOpenAI

tracker = CostTracker()
client = TrackedOpenAI(OpenAI(), tracker)

# Use exactly like the normal client, costs tracked automatically
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Hello!"}],
)
print(f"This call cost: \${tracker.total_cost:.6f}")`,
      },
    ],
    extrasInfo: {
      openai: "OpenAI client support",
      anthropic: "Anthropic client support",
    },
  },
]
