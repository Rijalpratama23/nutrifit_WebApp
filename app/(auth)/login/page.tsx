import Form from '@/components/componentsAuth/login/form/page';
import Gambar from '@/components/componentsAuth/login/page';

export default function LoginPage() {
  return (
    <div className="flex justify-center items-center mt-15 bg-gray-50">
      <div className='flex items-center shadow-lg rounded-xl'>
        <Form />
        <Gambar />
      </div>
    </div>
  );
}
