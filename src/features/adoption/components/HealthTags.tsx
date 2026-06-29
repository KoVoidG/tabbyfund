import { ShieldCheck } from "lucide-react";

interface HealthTagsProps {
  tags: string[];
}

/**
 * HealthTags — pill-shaped health status chips.
 */
export function HealthTags({ tags }: HealthTagsProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700"
        >
          <ShieldCheck size={9} strokeWidth={1.5} /> {tag}
        </span>
      ))}
    </div>
  );
}
