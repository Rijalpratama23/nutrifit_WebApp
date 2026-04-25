import SideBar from "../sideBar/page"
import ContainerPermintaan from "./ui/page"

export default function PagePermintaan() {
    return(
        <div className="min-h-screen bg-[#F0F7FF] flex">
            <SideBar />
            <ContainerPermintaan />
        </div>
    )
}