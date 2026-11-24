import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";

const GATEWAY = "https://ai.gateway.lovable.dev/v1";
const MODEL = "openai/gpt-6-astra";

export class AiWriterError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

export async function writeDescription(prompt: string, instructions: string) {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new AiWriterError("AI writing is not configured.", 500);
  const provider = createOpenAI({
    baseURL: GATEWAY,
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
  });
  let failure: unknown;
  const result = streamText({
    model: provider.responses(MODEL),
    system: instructions,
    prompt,
    providerOptions: {
      openai: {
        forceReasoning: true,
        reasoningEffort: "low",
        reasoningSummary: "auto",
        store: false,
        include: ["reasoning.encrypted_content"],
      },
    },
    onError: ({ error }) => {
      failure = error;
    },
  });
  let text = "";
  for await (const chunk of result.textStream) text += chunk;
  if (failure || !text.trim()) {
    const status = (failure as { statusCode?: number })?.statusCode ?? 500;
    console.error("AI writer failed", failure);
    if (status === 429) throw new AiWriterError("The AI writer is busy right now. Please try again in a minute.", 429);
    if (status === 402) throw new AiWriterError("AI credits have run out for this app. Please try again later.", 402);
    throw new AiWriterError("The AI writer couldn't produce a description. Please try again.", status);
  }
  return text.trim();
}
