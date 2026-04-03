import Link from "next/link"


export default function Cta() {
    return(
        <div>
            <Link href='/' className="flex justify-center">
                <button className="bg-primary text-white py-2 px-8 rounded-xl">
                    Lihat detail
                </button>
            </Link>
        </div>
    )
}