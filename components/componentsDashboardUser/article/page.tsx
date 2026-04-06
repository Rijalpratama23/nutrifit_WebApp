import SelectArtikel from './ui/selectKategori/page';
import CartArtikel from './ui/cartArtikel/page';

export default function PageArtikel() {
  return (
    <div>
      {/* carrousel */}
      <div className="mt-30 p-30 bg-yellow-300 rounded-2xl">carrousel</div>

      {/* pemilihan artikel */}
      <SelectArtikel />

      {/* card artikel */}
      <div className="mt-10 h-200 md:mt-15">
        <CartArtikel />
      </div>
    </div>
  );
}
