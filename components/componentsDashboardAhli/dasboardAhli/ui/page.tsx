
import HeaderKomponents from './header/page';
import StatisticCard from './statCart/page';
import TdataUser from './tabelData/page';


export default function ContainerDashboard() {
  return (
    <div className="flex-1 pl-72">
      <div className="p-8 lg:p-12">
        <HeaderKomponents />
        <StatisticCard />
        <TdataUser />
      </div>
    </div>
  );
}
