import Navbar from '@/components/componentsLandingPage/navbar/page';
import Hero from '@/components/componentsLandingPage/hero/page';
import Konsultasi from '@/components/componentsLandingPage/konsultasi/page';
import TimAhli from '@/components/componentsLandingPage/ahli/page';
import Artikel from '@/components/componentsLandingPage/cardArtikel/artikel/page';
import Footer from '@/components/footer/page';

export default function LandingPage() {
  return (
    <div className="overflow-x-hidden">
      <Navbar />
      <main className='pt-16'>
        <Hero />
        <Konsultasi />
        <TimAhli />
        <Artikel />
        <Footer />
      </main>
    </div>
  );
}
