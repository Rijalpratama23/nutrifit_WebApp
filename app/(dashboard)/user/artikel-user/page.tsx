import Link from 'next/link';
import { AppBar } from '@/components/dashboard';

export default function artikelUser() {
  return (
    <div id="artikelUser">
      <AppBar />
      <div className='flex justify-center mt-30 items-center'>
        <h1>page artikel</h1>
      </div>
    </div>
  );
}
