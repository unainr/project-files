import { cn } from "@/lib/utils";

type Props = {
  eyebrow: string;
  title: string;
  description?: string;
  id?: string;
  className?: string;
};

export function SectionHeading({ eyebrow, title, description, id, className }: Props) {
  return (
    <div className={cn("mx-auto max-w-2xl text-center", className)}>
      <span className="inline-flex items-center rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-700 dark:text-violet-300">
        {eyebrow}
      </span>
      <h2
        id={id}
        className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl"
      >
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-pretty text-muted-foreground sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}