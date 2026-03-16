import Image from "next/image"
import ButtonSecond from "@/components/button/secondaryButton/page"


type artikelLandingProps = {
    Img: string,
    title: string,
    text: string,
}

export default function ArtikelLanding({ Img, title, text }: artikelLandingProps ) {
    return(
        <>
            <div className="w-full md:w-1/2 md:flex  p-10 gap-10">
                <Image src={Img} alt="picture" width={100} height={10} />
                <div className="text-white w-55  md:w-65">
                    <h1 className="font-semibold pb-1 md:pb-2">{title}</h1>
                    <p className="text-sm md:pb-4">{text}</p>
                    <ButtonSecond text='Lihat Artikel' background='bg-secondary' />
                </div>
            </div>
        </>
    )
}