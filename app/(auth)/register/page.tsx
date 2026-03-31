import FormRegister from '@/components/componentsAuth/register/form/page';
import GambarRegister from '@/components/componentsAuth/register/img/page';

export default function RegisterPage() {
  return (
    /* Container Luar */
    <div className="min-h-screen w-full flex justify-center items-center bg-white md:bg-gray-50 px-4">
      {/* Card Utama: 
          - Mobile: No Shadow, No Border, Full Width
          - Desktop: Shadow, Border, Rounded-32px, Max-Width
      */}
      <div className="flex flex-col md:flex-row items-center bg-white md:shadow-2xl md:border md:border-gray-100 rounded-[32px] overflow-hidden w-full max-w-5xl md:max-h-[90vh]">
        {/* SISI KIRI: FORM (Full width di mobile, setengah di desktop) */}
        <div className="w-full md:w-1/2 p-4 md:p-12 lg:p-16 overflow-y-auto">
          <FormRegister />
        </div>

        {/* SISI KANAN: GAMBAR (Hanya muncul di Desktop) */}
        <div className="hidden md:flex md:w-1/2 justify-center items-center p-10 h-full bg-white">
          <div className="w-full h-full relative flex items-center justify-center">
            <GambarRegister />
          </div>
        </div>
      </div>
    </div>
  );
}
