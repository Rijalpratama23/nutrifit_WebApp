

import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  return (
    <header className='fixed top-0 left-0 right-0 z-[9999] h-16 flex justify-between items-center px-6 md:px-10 bg-white shadow-md'>
      <div className="logo md:flex justify-center items-center md:pt-5 md:pr-10">
        <Image src='/Logo.png' alt='logo' width={200} height={100}/>
      </div>
      <nav className="md:flex ">     
        <ul className='md:flex justify-between md:gap-15'>
            <li className='font-semibold md:font-bold hover-text-primary'>
                <Link href="#hero">Beranda</Link>
            </li>
             <li className='font-semibold md:font-bold hover-text-primary'>
                <Link href="#konsultasi">Konsultasi</Link>
            </li>
             <li className='font-semibold md:font-bold hover-text-primary'>
                <Link href="#tim">Tim Ahli</Link>
            </li>
             <li className='font-semibold md:font-bold hover-text-primary'>
                <Link href="#artikel">Artikel Kesehatan</Link>
            </li>
        </ul>
      </nav>

      <div className="md:flex justify-between items-center md:gap-5">
        <Link href='/register'><p className='font-semibold'>Daftar</p></Link>
        <Link href='/login'><button className='bg-primary font-semibold px-6 py-2 text-white rounded-xl'>Masuk</button></Link>
      </div>
    </header>
  );
}
