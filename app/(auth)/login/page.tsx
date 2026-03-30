import Form from '@/components/componentsAuth/login/form/page';
import Gambar from '@/components/componentsAuth/login/page';

export default function LoginPage() {
  return (
    <div className="h-screen w-full flex justify-center items-center bg-gray-50 overflow-hidden px-4">
      <div className="flex flex-col md:flex-row items-center bg-white shadow-2xl border border-gray-100 rounded-[32px] overflow-hidden w-full max-w-5xl max-h-[90vh]">
        <div className="w-full md:w-1/2 pt-6 md:pt-12 overflow-y-auto">
          <Form />
        </div>
        <div className="hidden md:flex md:w-1/2 justify-center items-center p-10 h-full">
          <div className="w-full h-full relative flex items-center justify-center">
            <Gambar />
          </div>
        </div>
      </div>
    </div>
  );
}
