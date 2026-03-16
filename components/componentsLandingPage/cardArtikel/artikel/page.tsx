import ArtikelLanding from "./artikelLanding/page"

export default function Artikel() {
    return(
         <div className="min-h-130 bg-primary">
                <div className="pl-20">
                  <h2 className="font-semibold text-white text-3xl pt-10">Artikel Kesehatan</h2>
                  <p className="text-white font-light">Pilih Artikel sesuai minat anda</p>
                </div>
                <div className="mx-20 flex justify-center">
                  <div className="pt-4 md:pt-8 flex justify-center flex-wrap">
                    <ArtikelLanding Img="/landingPage/diet.png" title="Tips Nutrisi" text="Menjaga pola makan sehat dapat di mulai dengan langkah sederhana" />
                    <ArtikelLanding Img="/landingPage/polamakan.png" title="Pola Makan" text="Menjaga pola makan sehat dapat di mulai dengan langkah sederhana" />
                    <ArtikelLanding Img="/landingPage/mitos&fakta.png" title="Mitos & Fakta" text="Menjaga pola makan sehat dapat di mulai dengan langkah sederhana" />
                    <ArtikelLanding Img="/landingPage/burble.png" title="Gaya Hidup" text="Menjaga pola makan sehat dapat di mulai dengan langkah sederhana" />
                  </div>
                </div>
              </div>
    )
}