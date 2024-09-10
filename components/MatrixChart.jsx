"use client";
import React, { useState, useEffect } from "react";

const MatrixChart = ({ firstColumnLabel, skillName, updateCombinedData }) => {
  const [skillsData, setSkillsData] = useState([
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
  ]);

  const handleSkillNameChange = (index, newName) => {
    const updatedSkillsData = [...skillsData];
    updatedSkillsData[index].skill = newName;
    setSkillsData(updatedSkillsData);
  };

  const roundToTwoDecimals = (num) => {
    return Math.ceil(num * 100) / 100;
  };

  const evaluateValue = (value) => {
    if (typeof value === "string" && value.includes("/")) {
      const parts = value.split("/");
      if (parts.length === 2) {
        const numerator = parseFloat(parts[0]);
        const denominator = parseFloat(parts[1]);
        return numerator / denominator;
      }
    }
    return parseFloat(value) || 0;
  };

  const handleInputChange = (rowIndex, colIndex, value) => {
    const updatedSkillsData = [...skillsData];

    if (rowIndex === colIndex) {
      updatedSkillsData[rowIndex].values[colIndex] = "1"; // Ensure diagonal values are set to 1
    } else {
      updatedSkillsData[rowIndex].values[colIndex] = value;
    }

    // Calculate the value below the diagonal
    const parsedValue = evaluateValue(value);
    if (!isNaN(parsedValue) && parsedValue !== 0) {
      updatedSkillsData[colIndex].values[rowIndex] = roundToTwoDecimals(
        1 / parsedValue
      );
    } else {
      updatedSkillsData[colIndex].values[rowIndex] = "";
    }

    // Recalculate totals
    updatedSkillsData.forEach((row, rowIndex) => {
      row.total =
        1 +
        row.values.reduce(
          (sum, val) =>
            sum + (isNaN(evaluateValue(val)) ? 0 : evaluateValue(val)),
          0
        );
    });

    const totalSum = updatedSkillsData.reduce((acc, row) => acc + row.total, 0);

    updatedSkillsData.forEach((row) => {
      row.percent =
        totalSum > 0
          ? parseFloat(((row.total / totalSum) * 100).toFixed(2))
          : 0;
      row.normalized =
        totalSum > 0 ? parseFloat((row.total / totalSum).toFixed(2)) : 0;
    });

    setSkillsData(updatedSkillsData);
  };

  useEffect(() => {
    updateCombinedData(skillName, skillsData);
  }, [skillsData]);

  // Find the highest percentage value
  const highestPercent = Math.max(...skillsData.map((row) => row.percent), 0);
  const totalSum = skillsData.reduce((acc, row) => acc + row.total, 0);
  const totalPercentSum = skillsData.reduce((acc, row) => acc + row.percent, 0);
  const totalNormalizedSum = skillsData.reduce((acc, row) => {
    return acc + (isNaN(row.normalized) ? 0 : row.normalized);
  }, 0);

  return (
    <div className="container mx-auto mt-8 p-4">
      <table className="min-w-full bg-white mb-8">
        <thead>
          <tr>
            <th className="py-2 px-4 border">{"Skills"}</th>
            <th className="py-2 px-4 border" colSpan={skillsData.length}>
              {skillName}
            </th>
          </tr>
          <tr>
            <th className="py-2 px-4 border">{firstColumnLabel}</th>
            {skillsData.map((row, colIndex) => (
              <th key={colIndex} className="py-2 px-4 border">
                <input
                  type="number"
                  value={row.skill}
                  onChange={(e) =>
                    handleSkillNameChange(colIndex, e.target.value)
                  }
                  className="w-full text-center"
                />
              </th>
            ))}

            <th className="py-2 px-4 border">Total</th>
            <th className="py-2 px-4 border">%</th>
            <th className="py-2 px-4 border">Normalized</th>
          </tr>
        </thead>
        <tbody>
          {skillsData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td className="py-2 px-4 border">{row.skill}</td>
              {row.values.map((value, colIndex) => (
                <td
                  key={colIndex}
                  className={`py-2 px-4 border ${
                    rowIndex === colIndex
                      ? "bg-green-200"
                      : rowIndex > colIndex
                      ? "bg-blue-200"
                      : "bg-yellow-200"
                  }`}
                >
                  {rowIndex === colIndex ? (
                    <input
                      type="number"
                      value={"1"}
                      readOnly
                      className="w-full text-center"
                    />
                  ) : rowIndex > colIndex ? (
                    <input
                      type="number"
                      value={value}
                      readOnly
                      className="w-full text-center"
                    />
                  ) : (
                    <input
                      type="number"
                      value={value || ""}
                      onChange={(e) =>
                        handleInputChange(rowIndex, colIndex, e.target.value)
                      }
                      className="w-full text-center"
                    />
                  )}
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
            {skillsData.map((_, index) => (
              <td key={index} className="py-2 px-4 border font-bold">
                {index === skillsData.length - 1 ? "Total" : ""}
              </td>
            ))}
            <td className="py-2 px-4 border font-bold">
              {totalSum.toFixed(2)}
            </td>
            <td className="py-2 px-4 border font-bold">
              {totalPercentSum.toFixed(1)}%
            </td>
            <td className="py-2 px-4 border font-bold">
              {totalNormalizedSum.toFixed(2)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default MatrixChart;
