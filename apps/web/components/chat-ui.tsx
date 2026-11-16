"use client";

import * as React from "react";
import { useChat } from "@ai-sdk/react";
import {
  DefaultChatTransport,
  getToolName,
  isToolUIPart,
  type UIMessage,
} from "ai";
import { useAuth } from "@clerk/nextjs";
import { Streamdown } from "streamdown";
import {
  ArrowUpIcon,
  CheckIcon,
  CopyIcon,
  RefreshCcwIcon,
  SparklesIcon,
  SquareIcon,
  WrenchIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { CodeBlock, CodeBlockContent } from "@/components/ui/code-block";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker";
import {
  Message,
  MessageContent,
  MessageFooter,
} from "@/components/ui/message";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller";
import { Spinner } from "@/components/ui/spinner";
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/components/ui/trace";

type ToolPart = Extract<UIMessage["parts"][number], { toolCallId: string }>;

const stringify = (value: unknown) =>
  typeof value === "string" ? value : JSON.stringify(value, null, 2);

const getText = (message: UIMessage) =>
  message.parts
    .map((part) => (part.type === "text" ? part.text : ""))
    .join("");

export function Chat() {
  const { getToken } = useAuth();
  const { messages, sendMessage, regenerate, status, stop, error } = useChat({
    transport: new DefaultChatTransport({
      api: `${process.env.NEXT_PUBLIC_API_URL}/api/chat`,
      headers: async () => ({ Authorization: `Bearer ${await getToken()}` }),
    }),
  });

  const [text, setText] = React.useState("");
  const formRef = React.useRef<HTMLFormElement>(null);

  const isBusy = status === "submitted" || status === "streaming";
  const canSend = text.trim().length > 0 && !isBusy;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSend) return;
    sendMessage({ text: text.trim() });
    setText("");
  };

  return (
    <div className="mx-auto flex h-dvh w-full max-w-3xl flex-col px-4 pb-4">
      <div className="relative min-h-0 flex-1">
        {messages.length === 0 && <EmptyState />}

        <MessageScrollerProvider autoScroll scrollPreviousItemPeek={48}>
          <MessageScroller className="h-full thin-scrollbar">
            <MessageScrollerViewport>
              <MessageScrollerContent
                className="gap-6 py-6"
                aria-busy={status === "streaming"}
              >
                {messages.map((message, index) => {
                  const isLast = index === messages.length - 1;
                  return (
                    <MessageScrollerItem
                      key={message.id}
                      messageId={message.id}
                      scrollAnchor={message.role === "user"}
                    >
                      {message.role === "user" ? (
                        <UserMessage text={getText(message)} />
                      ) : (
                        <AssistantMessage
                          message={message}
                          streaming={isBusy && isLast}
                          showActions={!isBusy || !isLast}
                          onRetry={() => regenerate({ messageId: message.id })}
                        />
                      )}
                    </MessageScrollerItem>
                  );
                })}

                {status === "submitted" && (
                  <MessageScrollerItem messageId="thinking">
                    <Message>
                      <Marker role="status">
                        <MarkerIcon>
                          <Spinner />
                        </MarkerIcon>
                        <MarkerContent>Thinking...</MarkerContent>
                      </Marker>
                    </Message>
                  </MessageScrollerItem>
                )}

                {error && (
                  <MessageScrollerItem messageId="error">
                    <Message>
                      <MessageContent>
                        <Bubble variant="destructive">
                          <BubbleContent>
                            {error.message ||
                              "Something went wrong. Please try again."}
                          </BubbleContent>
                        </Bubble>
                      </MessageContent>
                    </Message>
                  </MessageScrollerItem>
                )}
              </MessageScrollerContent>
            </MessageScrollerViewport>
            <MessageScrollerButton />
          </MessageScroller>
        </MessageScrollerProvider>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="mt-2">
        <InputGroup className="rounded-2xl">
          <InputGroupTextarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Message the assistant..."
            className="p-3"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                formRef.current?.requestSubmit();
              }
            }}
          />
          <InputGroupAddon align="block-end">
            {isBusy ? (
              <InputGroupButton
                type="button"
                size="icon-sm"
                variant="default"
                className="ml-auto rounded-full"
                aria-label="Stop"
                onClick={stop}
              >
                <SquareIcon />
              </InputGroupButton>
            ) : (
              <InputGroupButton
                type="submit"
                size="icon-sm"
                variant="default"
                className="ml-auto rounded-full"
                aria-label="Send"
                disabled={!canSend}
              >
                <ArrowUpIcon />
              </InputGroupButton>
            )}
          </InputGroupAddon>
        </InputGroup>
      </form>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 text-center">
      <div className="rounded-2xl bg-violet-500/10 p-3">
        <SparklesIcon className="size-6 text-violet-500" />
      </div>
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          How can I help you today?
        </h1>
        <p className="text-sm text-muted-foreground">Ask me anything.</p>
      </div>
    </div>
  );
}

function UserMessage({ text }: { text: string }) {
  return (
    <Message align="end">
      <MessageContent>
        <Bubble align="end" variant="muted">
          <BubbleContent className="whitespace-pre-wrap">{text}</BubbleContent>
        </Bubble>
      </MessageContent>
    </Message>
  );
}

function AssistantMessage({
  message,
  streaming,
  showActions,
  onRetry,
}: {
  message: UIMessage;
  streaming: boolean;
  showActions: boolean;
  onRetry: () => void;
}) {
  const [copied, setCopied] = React.useState(false);
  const text = getText(message);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Message>
      <MessageContent className="gap-2">
        {message.parts.map((part, i) => {
          const key = `${message.id}-${i}`;

          if (part.type === "text") {
            return <Streamdown key={key}>{part.text}</Streamdown>;
          }

          if (isToolUIPart(part)) {
            return (
              <Trace key={key}>
                <ToolLine part={part as ToolPart} streaming={streaming} />
              </Trace>
            );
          }

          return null;
        })}

        {showActions && text && (
          <MessageFooter>
            <Button variant="ghost" size="icon-sm" aria-label="Copy" onClick={copy}>
              {copied ? <CheckIcon /> : <CopyIcon />}
            </Button>
            <Button variant="ghost" size="icon-sm" aria-label="Retry" onClick={onRetry}>
              <RefreshCcwIcon />
            </Button>
          </MessageFooter>
        )}
      </MessageContent>
    </Message>
  );
}

function ToolLine({ part, streaming }: { part: ToolPart; streaming: boolean }) {
  const name = getToolName(part as Parameters<typeof getToolName>[0]);

  if (part.state === "output-denied") {
    return (
      <TraceLine>
        <TraceIcon>
          <WrenchIcon />
        </TraceIcon>
        <TraceTitle>Denied {name}</TraceTitle>
      </TraceLine>
    );
  }

  if (part.state === "output-available" || part.state === "output-error") {
    const body =
      part.state === "output-error" ? part.errorText : stringify(part.output);

    return (
      <TraceCollapsible>
        <TraceCollapsibleTrigger>
          <TraceLine status={part.state === "output-error" ? "error" : undefined}>
            <TraceIcon>
              <WrenchIcon />
            </TraceIcon>
            <TraceTitle>
              {part.state === "output-error" ? "Failed to run" : "Ran"} {name}
            </TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <CodeBlock size="sm">
            <CodeBlockContent wrap className="max-h-64">
              {body}
            </CodeBlockContent>
          </CodeBlock>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    );
  }

  return (
    <TraceLine status={streaming ? "running" : "error"}>
      <TraceIcon>
        <WrenchIcon />
      </TraceIcon>
      <TraceTitle>
        {streaming ? "Running" : "Failed to run"} {name}
      </TraceTitle>
    </TraceLine>
  );
}