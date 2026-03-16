import Link from "next/link"

type buttonProps = {
    text: string,
    background: string
}

export default function buttonSecond({ text, background } : buttonProps) {
    return(
        <div className="flex items-center">
            <Link href="/login">
                <button className={`${background} text-white py-2 px-10 rounded-lg`}>
                    {text}
                </button>
            </Link>
        </div>
    )
}