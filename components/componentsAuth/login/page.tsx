import Image from "next/image";


export default function Gambar() {
    return(
        <div>
            <Image src='/landingPage/hero.png' alt='picture' width={400} height={100} />
        </div>
    )
}