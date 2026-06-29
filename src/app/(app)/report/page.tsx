import { RescueWizard } from "@/features/report/components/RescueWizard";

export const metadata = {
  title: "Report Rescue — TabbyFund",
};

/**
 * /report — Rescue reporting page.
 * Renders the multi-step RescueWizard client component.
 */
export default function ReportPage() {
  return (
    <div className="py-2">
      <RescueWizard />
    </div>
  );
}
