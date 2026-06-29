import { Clock } from "lucide-react";
import { TabbyMascot } from "@/components/branding/TabbyMascot";

export const metadata = {
  title: "Verification Pending — TabbyFund",
};

/**
 * Vet pending verification page.
 * Shown when a vet account has is_verified = false.
 * They must wait for an admin to approve their account.
 */
export default function VetPendingPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4">
      <div className="w-full max-w-[400px] space-y-6 text-center">
        <TabbyMascot variant="think" size="lg" className="mx-auto" />
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#2D3748]">
            Verification Pending
          </h1>
          <p className="mt-2 text-sm text-[#2D3748]/60">
            Your veterinarian account is awaiting admin approval.
            You will be able to access the vet dashboard once verified.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-xs font-medium text-amber-700">
          <Clock size={14} strokeWidth={1.5} />
          Awaiting Verification
        </div>
      </div>
    </div>
  );
}
