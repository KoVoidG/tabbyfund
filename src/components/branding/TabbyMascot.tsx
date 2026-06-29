import Image from "next/image";

/**
 * TabbyMascot — the official TabbyFund mascot component.
 *
 * A gray-and-white tabby cat with multiple emotional variants.
 * This is the ONLY illustrated character in the product.
 * All other icons use lucide-react.
 *
 * Usage:
 *   <TabbyMascot variant="wave" size="md" />
 *   <TabbyMascot variant="think" size="lg" className="opacity-80" />
 */

export type MascotVariant =
  | "default"
  | "wave"
  | "happy"
  | "celebrate"
  | "donate"
  | "love"
  | "sleep"
  | "think"
  | "warning"
  | "confused"
  | "shy"
  | "sad";

export type MascotSize = "sm" | "md" | "lg" | "xl";

interface TabbyMascotProps {
  variant?: MascotVariant;
  size?: MascotSize;
  className?: string;
  /** Override alt text (defaults to variant-based description) */
  alt?: string;
}

const SIZE_MAP: Record<MascotSize, number> = {
  sm: 32,
  md: 64,
  lg: 96,
  xl: 128,
};

const ALT_MAP: Record<MascotVariant, string> = {
  default: "TabbyFund mascot",
  wave: "TabbyFund mascot waving hello",
  happy: "TabbyFund mascot smiling happily",
  celebrate: "TabbyFund mascot celebrating",
  donate: "TabbyFund mascot encouraging donations",
  love: "TabbyFund mascot showing love",
  sleep: "TabbyFund mascot sleeping peacefully",
  think: "TabbyFund mascot thinking",
  warning: "TabbyFund mascot showing a warning",
  confused: "TabbyFund mascot looking confused",
  shy: "TabbyFund mascot feeling shy",
  sad: "TabbyFund mascot feeling sad",
};

export function TabbyMascot({
  variant = "default",
  size = "md",
  className = "",
  alt,
}: TabbyMascotProps) {
  const px = SIZE_MAP[size];

  return (
    <Image
      src={`/mascot/tabby-${variant}-final1.png`}
      alt={alt ?? ALT_MAP[variant]}
      width={px}
      height={px}
      className={className}
      style={{ width: `${px}px`, height: "auto" }}
      priority={size === "xl"}
    />
  );
}
