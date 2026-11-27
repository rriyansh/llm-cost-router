# LLM Cost Router

A lightweight TypeScript starter for selecting a language model by task complexity, latency target, and budget.

## What it does

- Scores a request using its prompt length, requested reasoning level, and budget.
- Returns a predictable routing decision with an estimated cost.
- Keeps the routing policy in one small, testable module.
- Does not call providers or expose API keys; plug your provider client in after the decision.

## Quick start

```ts
import { routeRequest } from "./src/router";

const decision = routeRequest({
  prompt: "Summarise this short note",
  complexity: "low",
  maxCostUsd: 0.01,
});

console.log(decision.model);
```

## Next steps

Add provider adapters, observed token usage, a semantic cache, and persistent analytics before production use.
