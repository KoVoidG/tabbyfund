import { Heart } from "lucide-react";

interface PersonalityTagsProps {
  tags: string[];
}

/**
 * PersonalityTags — pill-shaped personality chips.
 */
export function PersonalityTags({ tags }: PersonalityTagsProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#6C5CE7]/12 px-3 py-1.5 text-xs font-semibold text-[#6c5ce7] shadow-sm border border-[#6C5CE7]/10"
        >
          <Heart size={10} className="fill-[#6c5ce7] text-[#6c5ce7]" /> {tag}
        </span>
      ))}
    </div>
  );
}
