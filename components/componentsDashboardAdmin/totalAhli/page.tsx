import SideBarAdmin from "../SideBarAdmin/page"
import ContainerTotalAhli from "./ui/page"


export default function PageTotalAhli() {
    return(
        <div className="min-h-screen bg-[#F0F7FF] flex">
            <SideBarAdmin />
            <ContainerTotalAhli />
        </div>
    )
}