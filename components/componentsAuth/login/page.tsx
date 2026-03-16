import Image from "next/image"
import Form from "./form/form"

export default function formLogin() {
    return(
        <div className="bg-light">
            <div className="md:flex justify-center gap-15 shadow-xl">
                <Form />

            </div>
        </div>
    )
}