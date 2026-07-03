import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";
import { AuthSplitLayout } from "@/features/auth/components/AuthSplitLayout";

export const metadata = {
  title: "Forgot Password — TabbyFund",
};

export default function ForgotPasswordPage() {
  return (
    <AuthSplitLayout
      mascotVariant="think"
      headline={<>Don&apos;t worry.</>}
      subtitle="We'll help you get back to rescuing cats."
    >
      <ForgotPasswordForm />
    </AuthSplitLayout>
  );
}
