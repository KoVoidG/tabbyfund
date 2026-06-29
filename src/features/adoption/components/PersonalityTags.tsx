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
          className="inline-flex items-center gap-1 rounded-full bg-[#6C5CE7]/8 px-2.5 py-1 text-[11px] font-medium text-[#6C5CE7]"
        >
          <Heart size={9} strokeWidth={1.5} /> {tag}
        </span>
      ))}
    </div>
  );
}
