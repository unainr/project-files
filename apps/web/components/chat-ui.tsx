"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import { isToolUIPart } from "ai";
import {
  Tool,
  ToolHeader,
  ToolContent,
  ToolInput,
  ToolOutput,
} from "@/components/ai-elements/tool";
import {
  PromptInput,
  PromptInputBody,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";
import { useAuth } from "@clerk/nextjs";
import { Spinner } from "./ui/spinner";
import { cn } from "@/lib/utils";
import { SparklesIcon } from "lucide-react";


export function Chat() {
  	const { getToken } = useAuth();
  const { messages, sendMessage, status, stop ,error} = useChat({
    
    transport: new DefaultChatTransport({
			api: `${process.env.NEXT_PUBLIC_API_URL}/api/chat`,
			headers: async () => {
				const token = await getToken();
				return { Authorization: `Bearer ${token}` };
			},
      	}),
   });

  const handleSubmit = (message: PromptInputMessage) => {
    const text = message.text?.trim();
    if (!text) return;
    sendMessage({ text });
  };

  return (
   <div className="mx-auto flex h-dvh w-full max-w-3xl flex-col px-4 pb-4">
  <Conversation className="flex-1 thin-scrollbar">
    <ConversationContent className="gap-6 py-6">
      
      {messages.length === 0 && (
        <div className="flex min-h-[55vh] flex-col items-center justify-center gap-5 text-center">
          <div className="rounded-2xl bg-violet-500/10 p-3">
            <SparklesIcon className="size-6 text-violet-500" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              How can I help you today?
            </h1>
            <p className="text-sm text-muted-foreground">
              Ask anything, or try one of these.
            </p>
          </div>
         
        </div>
      )}

      {messages.map((message) => (
        <Message from={message.role} key={message.id}>
          <MessageContent
            className={cn(
              "group-[.is-user]:rounded-2xl group-[.is-user]:rounded-br-sm",
              "group-[.is-user]:bg-violet-600 group-[.is-user]:px-4 group-[.is-user]:py-2.5",
              "group-[.is-user]:text-white group-[.is-user]:shadow-sm"
            )}
          >
            {message.parts.map((part, i) => {
              const key = `${message.id}-${i}`;

              if (part.type === "text") {
                // plain text for user bubble, markdown for assistant
                return message.role === "user" ? (
                  <p key={key} className="whitespace-pre-wrap">
                    {part.text}
                  </p>
                ) : (
                  <MessageResponse key={key}>{part.text}</MessageResponse>
                );
              }

              if (isToolUIPart(part)) {
                return (
                  <Tool key={key} defaultOpen={part.state === "output-error"}>
                    {part.type === "dynamic-tool" ? (
                      <ToolHeader
                        type={part.type}
                        toolName={part.toolName}
                        state={part.state}
                      />
                    ) : (
                      <ToolHeader type={part.type} state={part.state} />
                    )}
                    <ToolContent>
                      <ToolInput input={part.input} />
                      <ToolOutput
                        output={part.output}
                        errorText={part.errorText}
                      />
                    </ToolContent>
                  </Tool>
                );
              }

              return null;
            })}
          </MessageContent>
        </Message>
      ))}

      {status === "submitted" && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Spinner/> Thinking...
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error.message || "Something went wrong. Please try again."}
        </div>
      )}
    </ConversationContent>
    <ConversationScrollButton />
  </Conversation>

  <PromptInput
    onSubmit={handleSubmit}
    className="mt-2 rounded-2xl border shadow-sm focus-within:border-violet-500/60 focus-within:ring-2 focus-within:ring-violet-500/20"
  >
    <PromptInputBody>
      <PromptInputTextarea placeholder="Message the assistant..." />
    </PromptInputBody>
    <PromptInputFooter>
      <div />
      <PromptInputSubmit
        status={status}
        onStop={stop}
        className="bg-violet-600 text-white hover:bg-violet-500"
      />
    </PromptInputFooter>
  </PromptInput>
</div>
  );
}