


import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { clerkMiddleware, getAuth } from "@clerk/hono";
import { convertToModelMessages, stepCountIs, streamText, UIMessage,createUIMessageStreamResponse,toUIMessageStream } from "ai";
import { groq } from "@ai-sdk/groq";
import { requireUser } from "../middleware/auth";
import { tools } from "../tools";

const chatSchema = z.object({
  messages: z.array(z.custom<UIMessage>()),
});



const app = new Hono<{ Bindings: CloudflareBindings }>()
	
.get("/",async (c)=>{
    return c.json({message:"test route Hello world"})
})

.post("/",zValidator("json", chatSchema),requireUser, async (c)=>{
      const { messages } = c.req.valid("json");

    const result = await streamText({
        model:groq("openai/gpt-oss-120b"),
      system: "You are a helpful assistant.",
        messages: await convertToModelMessages(messages),
         tools,
    stopWhen: stepCountIs(5),
    })
    return createUIMessageStreamResponse({
        stream: toUIMessageStream({stream:result.stream})
    })
})

export default app;