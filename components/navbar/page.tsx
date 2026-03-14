

import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  return (
    <header className='w-screen h-18 md:flex justify-center items-center md:px-10 md:pr-25 gap-20'>
      <div className="logo md:flex justify-center items-center md:pt-5 md:pr-10">
        <Image src='/Logo.png' alt='logo' width={200} height={100}/>
      </div>
      <nav className="md:flex ">     
        <ul className='md:flex justify-between md:gap-15'>
            <li className='font-semibold md:font-bold hover-text-primary'>
                <Link href="">Beranda</Link>
            </li>
             <li className='font-semibold md:font-bold hover-text-primary'>
                <Link href="">Konsultasi</Link>
            </li>
             <li className='font-semibold md:font-bold hover-text-primary'>
                <Link href="">Tim Ahli</Link>
            </li>
             <li className='font-semibold md:font-bold hover-text-primary'>
                <Link href="">Artikel Kesehatan</Link>
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
