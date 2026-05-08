import SideBarAdmin from "../SideBarAdmin/page"
import ContainerTotalPengguna from "./ui/page"

export default function PageTotalPengguna() {
    return(
        <div className="min-h-screen bg-[#F0F7FF] flex">
            <SideBarAdmin />
            <PageTotalPengguna />

        </div>
    )
}