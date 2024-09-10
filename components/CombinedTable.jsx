"use client";
import React, { useState } from "react";
import { Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import MatrixChart from "./MatrixChart";
import { playerData } from "@/data/skill";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const CombinedTable = ({ skillsData1 }) => {
  const [combinedData, setCombinedData] = useState(
    playerData.map((data) => ({
      playerName: data.skill,
      data: skillsData1.reduce((acc, curr) => {
        acc[curr.skill] = [];
        return acc;
      }, {}),
    }))
  );

  const updateCombinedData = (skillName, data) => {
    let prev_data = combinedData;
    prev_data = prev_data.map((obj) => {
      const newValues = data.find((data) => data.skill == obj.playerName);
      return {
        ...obj,
        data: {
          ...obj.data,
          [skillName]: newValues.percent,
        },
      };
    });
    setCombinedData(prev_data);
    console.log(prev_data);
  };

  // Initialize an empty result object
  const result = {};

  // Iterate over each player
  combinedData.forEach((player) => {
    Object.keys(player.data).forEach((skill) => {
      // If the skill doesn't exist in result, initialize it as an empty array
      if (!result[skill]) {
        result[skill] = [];
      }
      // Push the player's skill value into the respective array
      result[skill].push(player.data[skill]);
    });
  });

  const SkillToColorMap = {
    Running: "red",
    Jumping: "yellow",
    Hitting: "pink",
    Dancing: "green",
  };

  const chartData = {
    labels: combinedData?.map((data) => data.playerName),
    datasets: Object.keys(result).map((key) => {
      return {
        label: key,
        data: result[key],
        backgroundColor: SkillToColorMap[key],
      };
    }),
  };

  const combinedChartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: `Players and skills summary %`,
        font: {
          size: 18,
        },
        padding: {
          top: 20,
          bottom: 30,
        },
      },
      datalabels: {
        display: true,
        color: "black",
        anchor: "end",
        align: "end",
        offset: 5,
        formatter: (value) => `${value}%`,
        font: {
          weight: "bold",
          size: 14,
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        titleColor: "white",
        bodyColor: "white",
        borderColor: "white",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Players",
          font: {
            size: 16,
          },
          color: "#000000",
        },
        barPercentage: 0.9, // Adjust bar width relative to the category width (0.9 means 90% of the available width)
        categoryPercentage: 1.0, // Adjust the space occupied by each category (1.0 means 100% of the category width)
      },
      y: {
        title: {
          display: true,
          text: "Percentage",
          font: {
            size: 16,
          },
          color: "#000000",
        },
        ticks: {
          callback: function (value) {
            return value + "%";
          },
        },
        beginAtZero: true,
        suggestedMax: (context) => {
          const maxValue = Math.max(
            ...context.chart.data.datasets.flatMap((dataset) => dataset.data)
          );
          return maxValue + 5;
        },
      },
    },
  };

  return (
    <div className="container mx-auto mt-8 p-4">
      {skillsData1?.map((data) => {
        return (
          <MatrixChart
            key={data.skill}
            firstColumnLabel={"Player"}
            skillName={data.skill}
            updateCombinedData={updateCombinedData}
          />
        );
      })}
      <Bar data={chartData} options={combinedChartOptions} />
    </div>
  );
};

export default CombinedTable;
