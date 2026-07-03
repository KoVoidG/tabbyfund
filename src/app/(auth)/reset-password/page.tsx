import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";
import { AuthSplitLayout } from "@/features/auth/components/AuthSplitLayout";

export const metadata = {
  title: "New Password — TabbyFund",
};

export default function ResetPasswordPage() {
  return (
    <AuthSplitLayout
      mascotVariant="celebrate"
      headline={<>Choose a new password.</>}
      subtitle="Regain access to your rescuer account."
    >
      <div className="space-y-6">
        <div className="space-y-1">
          <h2 className="font-heading text-2xl font-black text-[#25324B] tracking-tight">
            New Password
          </h2>
          <p className="text-xs text-[#6F7895] font-semibold leading-normal">
            Enter your new credentials below.
          </p>
        </div>

        <ResetPasswordForm />
      </div>
    </AuthSplitLayout>
  );
}
