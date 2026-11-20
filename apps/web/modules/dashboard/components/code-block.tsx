"use client";

import * as React from "react";
import { motion } from "motion/react";
import { DownloadIcon, FileCodeIcon, TerminalIcon, WrapTextIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  CodeBlock as CodeBlockRoot,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from "@/components/ui/code-block";
import { useHighlightedCode } from "@/hooks/use-highlighted-code";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  code: string;
  /** "bash" | "ts" | "tsx" | "json" ... Auto-detected from the code when omitted. */
  language?: string;
  /** Download file name. Derived from the title when omitted. */
  filename?: string;
  /** 1-based line numbers to highlight. */
  highlightLines?: number[];
  className?: string;
};

const SHELL_PREFIXES = ["npm ", "pnpm ", "yarn ", "npx ", "bun ", "curl ", "git "];
const EXTENSIONS: Record<string, string> = { bash: "sh", ts: "ts", tsx: "tsx", js: "js", json: "json" };

const detectLanguage = (code: string) => (SHELL_PREFIXES.some((p) => code.startsWith(p)) ? "bash" : "ts");

// "1. Install" -> "install"
const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/^\d+\.\s*/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "snippet";

function download(value: string, filename: string) {
  const url = URL.createObjectURL(new Blob([value], { type: "text/plain" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function CodeBlock({ title, code, language, filename, highlightLines = [], className }: Props) {
  const [wrap, setWrap] = React.useState(false);

  const lang = language ?? detectLanguage(code);
  const isShell = lang === "bash";
  const multiline = code.trim().includes("\n");
  const lines = useHighlightedCode(code, lang);
  const downloadName = filename ?? `${slugify(title)}.${EXTENSIONS[lang] ?? "txt"}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn("w-full", className)}
    >
      <CodeBlockRoot>
        <CodeBlockHeader>
          <CodeBlockTitle>
            <span className="mr-1 flex gap-1.5" aria-hidden>
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
            </span>
            {isShell ? <TerminalIcon /> : <FileCodeIcon />}
            {title}
          </CodeBlockTitle>

          <CodeBlockActions>
            {multiline && (
              <>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  aria-label="Wrap lines"
                  aria-pressed={wrap}
                  className="aria-pressed:text-foreground"
                  onClick={() => setWrap((value) => !value)}
                >
                  <WrapTextIcon />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  aria-label="Download"
                  onClick={() => download(code, downloadName)}
                >
                  <DownloadIcon />
                </Button>
              </>
            )}
            <CodeBlockCopyButton value={code} />
          </CodeBlockActions>
        </CodeBlockHeader>

        <CodeBlockContent wrap={wrap} lineNumbers={multiline && !isShell}>
          {lines.map((line, index) => (
            <CodeBlockLine key={index} variant={highlightLines.includes(index + 1) ? "highlighted" : "default"}>
              {line}
            </CodeBlockLine>
          ))}
        </CodeBlockContent>
      </CodeBlockRoot>
    </motion.div>
  );
}