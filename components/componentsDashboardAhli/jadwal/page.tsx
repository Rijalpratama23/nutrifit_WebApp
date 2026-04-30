import SideBar from "../sideBar/page"
import ContainerJadwal from "./ui/page"



export default function ContentJadwal() {
    return(
        <div className="min-h-screen bg-[#F0F7FF] flex">
            <SideBar />
            <ContainerJadwal />
        </div>
    )
}