import Image from "next/image"

export default function Gambar() {
    return(
        <div>
            <Image src="/landingPage/hero.png" alt="picture" width={100} height={50} />
        </div>
    )
}