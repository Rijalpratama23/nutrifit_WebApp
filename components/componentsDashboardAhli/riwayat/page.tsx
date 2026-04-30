import SideBar from "../sideBar/page"
import ContainerRiwayat from "./ui/page"

export default function PageRiwayat() {
    return(
        <div className="min-h-screen bg-[#F0F7FF] flex">
            <SideBar />
            <ContainerRiwayat />
        </div>
    )
}