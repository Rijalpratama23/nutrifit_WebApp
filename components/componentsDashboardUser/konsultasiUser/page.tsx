import HeaderKonsul from "./ui/header/page";
import TabNavigation from "./ui/tabNavigations/page";
import ContainerCard from "./ui/containerCard/page";




export default function PageKonsultasi() {
  return <div className="px-4 mt-5 md:mt-20 sm:px-6 md:px-8 lg:px-12 pt-6 sm:pt-8 md:pt-10 pb-8">
    <HeaderKonsul />
    <TabNavigation />
    <ContainerCard />
  </div>;
}
