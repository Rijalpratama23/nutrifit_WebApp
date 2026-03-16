"use client"

import Link from "next/link"

export default function ButtonXl() {
    return(
        <div>
            <Link href='/login'><button className="bg-primary text-white font-semibold md:py-4 md:px-6 rounded-xl">Konsultasi Sekarang!</button></Link> 
        </div>
    )
}