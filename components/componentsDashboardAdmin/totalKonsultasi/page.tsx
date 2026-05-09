import SideBarAdmin from "../SideBarAdmin/page";
import ContainerTotalKonsultasi from "./ui/page";

export default function PageTotalKonsultasi() {
    return(
        <div className="min-h-screen bg-[#F0F7FF] flex">
            <SideBarAdmin />
            <ContainerTotalKonsultasi />
        </div>
    )
}