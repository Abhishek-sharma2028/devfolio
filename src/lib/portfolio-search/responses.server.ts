import { createOpenAI } from "@ai-sdk/openai";
import { streamText, Output, type ModelMessage } from "ai";
import { z } from "zod";

import {
  createLovableAiGatewayRunIdFetch,
  getLovableAiGatewayRunId,
  withLovableAiGatewayRunIdHeader,
} from "./run-id.server.ts";

export const matchSchema = z.object({ matches: z.array(z.object({ id: z.string(), reason: z.string(), score: z.number() }).strict()) }).strict();

export class SearchAiError extends Error {
  constructor(message: string, public status: number, public blocked: boolean = false) { super(message); }
}

export function createResponsesCall(
  request: Request,
  config: { baseURL: string; apiKey: string; model: string },
  messages: ModelMessage[],
  instructions?: string,
) {
  const runIdFetch = createLovableAiGatewayRunIdFetch(getLovableAiGatewayRunId(request));
  const provider = createOpenAI({
    baseURL: `${config.baseURL.replace(/\/+$/, "").replace(/\/v1$/, "")}/v1`,
    apiKey: config.apiKey,
    headers: { "Lovable-API-Key": config.apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: async (input, init) => {
      const response = await runIdFetch.fetch(input, init);
      if (!response.ok) {
        let message = "AI search is unavailable. Please try again later.";
        try {
          const body = await response.clone().json() as { message?: string; error?: { message?: string } };
          message = body.message || body.error?.message || message;
        } catch { /* Keep safe fallback for non-JSON responses. */ }
        throw new SearchAiError(message, response.status, response.status === 403);
      }
      if (!response.body) return response;
      // Detect terminal SSE refusals/errors even after HTTP 200 headers.
      const decoder = new TextDecoder();
      let pending = "";
      const body = response.body.pipeThrough(new TransformStream<Uint8Array, Uint8Array>({
        transform(chunk, controller) {
          pending += decoder.decode(chunk, { stream: true });
          const lines = pending.split("\n");
          pending = lines.pop() ?? "";
          for (const line of lines) {
            if (!line.startsWith("data:")) continue;
            const json = line.slice(5).trim();
            if (!json || json === "[DONE]") continue;
            let event: { type?: string; delta?: string; refusal?: string; error?: { message?: string } };
            try { event = JSON.parse(json); } catch { continue; }
            if (event.type?.startsWith("response.refusal.")) {
              controller.error(new SearchAiError(event.refusal || event.delta || "The AI declined this search.", 422));
              return;
            }
            if (event.type === "error" || event.type === "response.failed") {
              controller.error(new SearchAiError(event.error?.message || "AI search could not complete.", 502));
              return;
            }
          }
          controller.enqueue(chunk);
        },
      }));
      return new Response(body, { status: response.status, headers: response.headers });
    },
  });
  const reasoning = config.model !== "openai/chat-latest";
  const result = streamText({
    model: provider.responses(config.model),
    // AI SDK 6 lacks `instructions`: rename this key to `system` there.
    ...(instructions ? { instructions } : {}),
    messages,
    output: Output.object({ schema: matchSchema }),
    maxRetries: 0,
    abortSignal: request.signal,
    providerOptions: {
      openai: {
        store: false,
        ...(reasoning
          ? {
              forceReasoning: true,
              reasoningEffort: "medium",
              reasoningSummary: "auto",
              include: ["reasoning.encrypted_content"],
            }
          : {}),
      },
    },
  });
  return {
    result,
    getRunId: runIdFetch.getRunId,
    response: () =>
      withLovableAiGatewayRunIdHeader(result.toUIMessageStreamResponse({ sendReasoning: true }), runIdFetch),
  };
}
