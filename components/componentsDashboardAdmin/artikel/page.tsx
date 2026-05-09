import SideBarAdmin from "../SideBarAdmin/page"
import ContainerArtikel from "./ui/page"


export default function PageArtikelAdmin() {
    return(
        <div className="min-h-screen bg-[#F0F7FF] flex">
            <SideBarAdmin />
            <ContainerArtikel />
        </div>
    )
}