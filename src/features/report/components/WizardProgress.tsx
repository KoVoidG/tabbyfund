import { Camera, Brain, MapPin, FileText, CheckCircle } from "lucide-react";

const steps = [
  { icon: Camera, label: "Photo" },
  { icon: Brain, label: "AI" },
  { icon: MapPin, label: "Location" },
  { icon: FileText, label: "Details" },
  { icon: CheckCircle, label: "Review" },
];

interface WizardProgressProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
}

/**
 * WizardProgress — step indicator for the rescue wizard.
 * Shows 5 steps with icons. Completed steps are purple, current has ring.
 */
export function WizardProgress({ currentStep, onStepClick }: WizardProgressProps) {
  return (
    <div className="flex items-center justify-between px-2">
      {steps.map((step, i) => {
        const Icon = step.icon;
        const isCompleted = i < currentStep;
        const isCurrent = i === currentStep;
        const isClickable = i < currentStep && onStepClick;

        return (
          <div key={step.label} className="flex items-center flex-1 last:flex-none">
            <button
              type="button"
              disabled={!isClickable}
              onClick={() => isClickable && onStepClick(i)}
              className={`flex flex-col items-center gap-1 ${isClickable ? "cursor-pointer" : "cursor-default"}`}
            >
              <div className={`flex h-9 w-9 items-center justify-center rounded-full transition-all ${
                isCompleted
                  ? "bg-[#6C5CE7] text-white"
                  : isCurrent
                  ? "bg-[#6C5CE7] text-white ring-4 ring-[#6C5CE7]/20"
                  : "bg-[#F7F7FB] text-[#2D3748]/25"
              }`}>
                <Icon size={16} strokeWidth={1.5} />
              </div>
              <span className={`text-[9px] font-medium whitespace-nowrap ${
                isCompleted || isCurrent ? "text-[#6C5CE7]" : "text-[#2D3748]/35"
              }`}>
                {step.label}
              </span>
            </button>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1.5 rounded-full ${
                i < currentStep ? "bg-[#6C5CE7]" : "bg-[#A788FA]/12"
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
