import Chart from "@/components/Chart";
// import Table from "@/components/Table";
import Table from "./table";

export default function Home() {
  const skillsData1 = [
    {
      skill: "Running",
      values: ["", "", "", ""],
      total: 0,
      percent: 0,
      normalized: 0,
    },
    {
      skill: "Jumping",
      values: ["", "", "", ""],
      total: 0,
      percent: 0,
      normalized: 0,
    },
    {
      skill: "Hitting",
      values: ["", "", "", ""],
      total: 0,
      percent: 0,
      normalized: 0,
    },
    {
      skill: "Dancing",
      values: ["", "", "", ""],
      total: 0,
      percent: 0,
      normalized: 0,
    },
  ];

  const skillsData2 = [
    {
      skill: "Javier",
      values: ["", "", "", ""],
      total: 0,
      percent: 0,
      normalized: 0,
    },
    {
      skill: "Alex",
      values: ["", "", "", ""],
      total: 0,
      percent: 0,
      normalized: 0,
    },
    {
      skill: "Cody",
      values: ["", "", "", ""],
      total: 0,
      percent: 0,
      normalized: 0,
    },
    {
      skill: "Dan",
      values: ["", "", "", ""],
      total: 0,
      percent: 0,
      normalized: 0,
    },
  ];
  return (
    <div>
      {/* <Table /> */}
      <Chart skillsData={skillsData1} firstColumnLabel="Skills" />
      <Chart skillsData={skillsData2} firstColumnLabel="Players" />
    </div>
  );
}
