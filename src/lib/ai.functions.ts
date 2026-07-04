import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const AskInput = z.object({
  message: z.string().min(1).max(2000),
  currentWeek: z.number().int().min(1).max(45).optional(),
});

const SYSTEM_PROMPT = `You are Nurture's supportive AI pregnancy assistant.

Rules:
- Warm, calm, encouraging tone. Speak to the mother directly.
- Answer questions about pregnancy: nutrition, symptoms, baby development, self-care, exercise, medication safety.
- Never give a diagnosis. Always recommend consulting a doctor or midwife for concerns, medications, bleeding, severe pain, reduced movement, or emergencies.
- Keep answers concise (2-4 short paragraphs). Use bullet points for lists. No markdown headings.
- If asked something outside pregnancy/motherhood/newborn care, gently redirect.`;

export const askAssistant = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => AskInput.parse(input))
  .handler(async ({ data, context }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("AI is not configured");

    // load recent chat history for context (last 10 messages)
    const { data: history } = await context.supabase
      .from("ai_messages")
      .select("role, content")
      .order("created_at", { ascending: false })
      .limit(10);

    const prior = (history ?? []).reverse().map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

    const weekContext = data.currentWeek
      ? `\nContext: The user is currently in week ${data.currentWeek} of pregnancy.`
      : "";

    const gateway = createLovableAiGatewayProvider(key);
    const { text } = await generateText({
      model: gateway("google/gemini-3-flash-preview"),
      messages: [
        { role: "system", content: SYSTEM_PROMPT + weekContext },
        ...prior,
        { role: "user", content: data.message },
      ],
    });

    // Persist both messages
    await context.supabase.from("ai_messages").insert([
      { user_id: context.userId, role: "user", content: data.message },
      { user_id: context.userId, role: "assistant", content: text },
    ]);

    return { reply: text };
  });
