import FormRegister from "@/components/componentsAuth/register/form/page";
import GambarRegister from "@/components/componentsAuth/register/img/page";

export default function LoginPage() {
  return (
    <div className="flex justify-center items-center mt-15 bg-gray-50">
      <div className='flex items-center shadow-lg rounded-xl'>
        <FormRegister />
        <GambarRegister />
      </div>
    </div>
  );
}
