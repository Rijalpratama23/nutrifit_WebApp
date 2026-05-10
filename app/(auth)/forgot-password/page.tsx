import ForgotPasswordForm from "@/components/componentsAuth/forgotPassword/page";

export default function ForgotPasswordPage() {
  return (
    <div className="h-screen w-full flex justify-center items-center bg-gray-50 px-4">
      <div className="bg-white shadow-2xl border border-gray-100 rounded-[32px] p-10 w-full max-w-md">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}