const roundToTwoDecimals = (num) => Math.ceil(num * 100) / 100;

const evaluateValue = (value) => {
  if (typeof value === "string" && value.includes("/")) {
    const [numerator, denominator] = value.split("/").map(parseFloat);
    return numerator / denominator;
  }
  return parseFloat(value) || 0;
};

export const handleInputChange = (skillsData, rowIndex, colIndex, value) => {
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
  updatedSkillsData.forEach((row) => {
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
      totalSum > 0 ? parseFloat(((row.total / totalSum) * 100).toFixed(2)) : 0;
    row.normalized =
      totalSum > 0 ? parseFloat((row.total / totalSum).toFixed(2)) : 0;
  });

  return updatedSkillsData;
};
