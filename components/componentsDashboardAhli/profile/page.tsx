import SideBar from "../sideBar/page"
import ContainerProfile from "./ui/page"


export default function PageProfile() {
    return (
        <div className="min-h-screen bg-[#F0F7FF] flex">
            <SideBar /> 
            <ContainerProfile />
        </div>
    )
}