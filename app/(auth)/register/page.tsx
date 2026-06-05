import FormRegister from '@/components/componentsAuth/register/form/page';
import GambarRegister from '@/components/componentsAuth/register/img/page';

export default function RegisterPage() {
  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-white md:bg-gray-50 px-4">

      <div className="flex flex-col md:flex-row items-center bg-white md:shadow-2xl md:border md:border-gray-100 rounded-[32px] overflow-hidden w-full max-w-5xl md:max-h-[90vh]">
        <div className="w-full md:w-1/2 p-4 md:p-12 lg:p-16 overflow-y-auto">
          <FormRegister />
        </div>
        <div className="hidden md:flex md:w-1/2 justify-center items-center p-10 h-full bg-white">
          <div className="w-full h-full relative flex items-center justify-center">
            <GambarRegister />
          </div>
        </div>
      </div>
    </div>
  );
}
