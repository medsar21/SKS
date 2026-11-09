import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  title: ReactNode;
  eyebrow?: string;
  description?: ReactNode;
  action?: ReactNode;
  level?: 1 | 2 | 3;
  id?: string;
  className?: string;
};

export function SectionHeading({
  title,
  eyebrow,
  description,
  action,
  level = 2,
  id,
  className,
}: SectionHeadingProps) {
  const Heading = level === 1 ? "h1" : level === 3 ? "h3" : "h2";
  return (
    <div className={cn("section-heading", className)}>
      <div>
        {eyebrow && <p className="eyebrow text-accent-strong">{eyebrow}</p>}
        <Heading id={id}>{title}</Heading>
        {description && <p className="muted mt-5 max-w-2xl">{description}</p>}
      </div>
      {action && <div className="section-heading-action">{action}</div>}
    </div>
  );
}
