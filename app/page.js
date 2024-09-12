import Chart from "@/components/Chart";
import CombinedTable from "@/components/CombinedTable";
import { _skillsData, playerData } from "@/data/skill";

export default function Home() {
  return (
    <div>
      <Chart skillsData={_skillsData} firstColumnLabel="Skills" />
      <Chart skillsData={playerData} firstColumnLabel="Players" />
      <CombinedTable
        skillsData1={_skillsData}
        firstColumnLabel1="Skills"
        firstColumnLabel2="Players"
      />
    </div>
  );
}
