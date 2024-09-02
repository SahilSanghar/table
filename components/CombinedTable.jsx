"use client";
import React, { useState } from "react";
import { handleInputChange } from "../utils/skillDataUtils";

const CombinedTable = ({
  skillsData1,
  skillsData2,
  firstColumnLabel1,
  firstColumnLabel2,
}) => {
  const [skillsData, setSkillsData] = useState(skillsData1);
  const [playersData] = useState(skillsData2);

  // Handle input changes
  const onInputChange = (rowIndex, colIndex, value) => {
    const updatedSkillsData = handleInputChange(
      skillsData,
      rowIndex,
      colIndex,
      value
    );
    setSkillsData(updatedSkillsData);
  };

  // Combine skills and player names into a nested table structure
  const combinedData = skillsData.map((skillRow) => ({
    skill: skillRow.skill,
    values: skillRow.values,
  }));

  const matrix = combinedData.map((skillRow, skillIndex) => ({
    skill: skillRow.skill,
    values: playersData.map((player, playerIndex) => ({
      playerName: player.skill, // Assuming `skill` is the property that holds the player's name in `playersData`
      value: skillRow.values[playerIndex] || "", // This maps player data to each skill
    })),
  }));

  const highestPercent = 1;

  //   const highestPercentCombined = Math.max(
  //     ...matrix.flatMap((row) => row.players.map((player) => player.value)),
  //     0
  //   );

  // Calculate totals and other metrics
  const totalSum = matrix
    .flatMap((row) => row.values)
    .reduce((acc, item) => acc + (parseFloat(item.value) || 0), 0);
  const totalPercentSum = 0;

  //   const totalPercentSum = matrix
  //     .flatMap((row) => row.players)
  //     .reduce((acc, player) => acc + (parseFloat(player.values) || 0), 0)
  //     .toFixed(1);

  const totalNormalizedSum = matrix
    .flatMap((row) => row.values)
    .reduce(
      (acc, item) =>
        acc + (isNaN(parseFloat(item.value)) ? 0 : parseFloat(item.value)),
      0
    );

  const totalColumns = combinedData.length * 7;

  return (
    <div className="container mx-auto mt-8 p-4">
      <table className="min-w-full bg-white mb-8 border-collapse ">
        <thead>
          <tr className="bg-[#fbc02d]">
            <th className="py-2 px-4 border skill-header">
              {firstColumnLabel1}
            </th>
            {combinedData.map((row, index) => (
              <th
                key={`skill-header-${index}`}
                colSpan={playersData.length}
                className="py-2 px-4 border"
              >
                {row.skill}
              </th>
            ))}
            <th
              className="py-2 px-4 border bg-[#ce93d8]"
              colSpan={totalColumns}
            >
              Total of Totals
            </th>
          </tr>
          <tr>
            <th className="py-2 px-4 border bg-[#ffff00]">
              {firstColumnLabel2}
            </th>
            {combinedData.map((row, rowIndex) => (
              <React.Fragment key={`empty-header-${rowIndex}`}>
                {playersData.map((player, playerIndex) => (
                  <th
                    key={`empty-cell-${rowIndex}-${playerIndex}`}
                    className="py-2 px-4 border bg-[#ffff00]"
                  >
                    {player.skill}
                  </th>
                ))}
              </React.Fragment>
            ))}
            {combinedData.map((row, index) => {
              const colors = [
                "bg-[#fbc02d]",
                " bg-[#ffff00]",
                "bg-[#9ccc65]",
                "bg-[#82b1ff]",
              ];
              const colorClass = colors[index % colors.length];
              return (
                <React.Fragment key={`skill-headers-${index}`}>
                  <th
                    colSpan={playersData.length}
                    className={`py-2 px-4 border  ${colorClass}`}
                  >
                    {row.skill}
                  </th>
                  <th className="py-2 px-4 border">%</th>
                  <th className="py-2 px-4 border">Normalized</th>
                </React.Fragment>
              );
            })}
            <th className="py-2 px-4 border bg-[#9c27b0]">Total of Totals</th>
            <th className="py-2 px-4 border">%</th>
            <th className="py-2 px-4 border">Normalized</th>
          </tr>
        </thead>
        <tbody>
          {matrix.map((row, rowIndex) => (
            <tr key={`player-row-${rowIndex}`}>
              {row.values.map((item, colIndex) => (
                <td
                  key={`player-cell-${rowIndex}-${colIndex}`}
                  className="py-2 px-4 border"
                >
                  {rowIndex === 0 ? item.playerName : ""}
                </td>
              ))}
              {row.values.map((cell, colIndex) => (
                <td
                  key={`cell-${rowIndex}-${colIndex}`}
                  className="py-2 px-4 border"
                >
                  <input
                    type="text"
                    value={cell.value || ""}
                    onChange={(e) =>
                      onInputChange(rowIndex, colIndex, e.target.value)
                    }
                    className="w-full text-center"
                  />
                </td>
              ))}
              <td className="py-2 px-4 border">
                {(row.total || 0).toFixed(2)}
              </td>
              <td
                className={`py-2 px-4 border ${
                  row.percent === highestPercent
                    ? "font-bold text-red-500"
                    : "text-red-500"
                }`}
              >
                {(row.percent || 0).toFixed(2)}%
              </td>
              <td className="py-2 px-4 border">
                {(row.normalized || 0).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td className="py-2 px-4 border font-bold"></td>
            {combinedData.flatMap((row) =>
              playersData.map((_, index) => (
                <td key={index} className="py-2 px-4 border font-bold"></td>
              ))
            )}
            <td className="py-2 px-4 border font-bold">
              {totalSum.toFixed(2)}
            </td>
            <td className="py-2 px-4 border font-bold">{totalPercentSum}%</td>
            <td className="py-2 px-4 border font-bold">{totalNormalizedSum}</td>
          </tr>
        </tfoot>
      </table>
      <style jsx>{`
        .skill-header {
          width: 120px; /* Adjust this width as needed */
        }
        .skill-col {
          width: 120px; /* Ensure this matches if you want consistent column width */
        }
      `}</style>
    </div>
  );
};

export default CombinedTable;
