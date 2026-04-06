import Link from 'next/link';
import AppBar from '@/components/componentsDashboardUser/appBar/page';
import PageArtikel from '@/components/componentsDashboardUser/article/page';

export default function artikelUser() {
  return (
    <div id="artikelUser">
      <AppBar />
      <PageArtikel />
    </div>
  );
}
