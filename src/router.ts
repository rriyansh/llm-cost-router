export type Complexity = "low" | "medium" | "high";

export interface RouteRequest {
  prompt: string;
  complexity?: Complexity;
  maxCostUsd?: number;
  latencySensitive?: boolean;
}

export interface RouteDecision {
  model: "small-fast" | "balanced" | "reasoning";
  reason: string;
  estimatedCostUsd: number;
}

const PRICING = {
  "small-fast": 0.002,
  balanced: 0.008,
  reasoning: 0.03,
} as const;

export function routeRequest(request: RouteRequest): RouteDecision {
  const complexity = request.complexity ?? inferComplexity(request.prompt);
  const budget = request.maxCostUsd ?? Infinity;

  const preferred =
    complexity === "high" ? "reasoning" :
    complexity === "medium" ? "balanced" :
    "small-fast";

  const candidates: RouteDecision["model"][] =
    request.latencySensitive ? ["small-fast", "balanced", "reasoning"] :
    [preferred, "balanced", "small-fast"];

  const model = candidates.find((candidate) => PRICING[candidate] <= budget) ?? "small-fast";

  return {
    model,
    estimatedCostUsd: PRICING[model],
    reason: `Selected ${model} for a ${complexity}-complexity request within the configured budget.`,
  };
}

function inferComplexity(prompt: string): Complexity {
  const normalized = prompt.toLowerCase();
  if (prompt.length > 1800 || /reason|compare|architecture|multi-step/.test(normalized)) return "high";
  if (prompt.length > 500 || /explain|plan|analyse|analyze/.test(normalized)) return "medium";
  return "low";
}
