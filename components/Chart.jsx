"use client";
import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const Chart = () => {
  // Initial state for skills data
const [skillsData, setSkillsData] = useState([
    { skill: 'Running', values: [1, 3, 2, 0.5], total: 6.5, percent: 31.45, normalized: 0.31 },
    { skill: 'Jumping', values: [1/3, 1, 2, 1/3], total: 3.67, percent: 17.74, normalized: 0.18 },
    { skill: 'Hitting', values: [0.5, 1/2, 1, 0.5], total: 2.5, percent: 12.1, normalized: 0.12 },
    { skill: 'Dancing', values: [2, 3, 2, 1], total: 8, percent: 38.71, normalized: 0.39 },
]);

  // Function to handle input change
    const handleInputChange = (rowIndex, colIndex, value) => {
    if (rowIndex <= colIndex) {
    const updatedSkillsData = [...skillsData];
    updatedSkillsData[rowIndex].values[colIndex] = parseFloat(value);
      // Ensure diagonal cells have value of 1
    updatedSkillsData[rowIndex].values[rowIndex] = 1;

      // Recalculate total, percent, and normalized values
    updatedSkillsData[rowIndex].total = updatedSkillsData[rowIndex].values.reduce((acc, val) => acc + val, 0);
    const totalSum = updatedSkillsData.reduce((acc, row) => acc + row.total, 0);
    updatedSkillsData.forEach(row => {
        row.percent = parseFloat(((row.total / totalSum) * 100).toFixed(2));
        row.normalized = parseFloat((row.total / totalSum).toFixed(2));
    });
    setSkillsData(updatedSkillsData);
    }
};

  // Function to add a new skill
    const addSkill = (skillName) => {
    const newSkill = {
        skill: skillName,
        values: new Array(skillsData.length + 1).fill(1), // Fill initial values with 1
        total: skillsData.length + 1,
        percent: 0,
        normalized: 0,
    };
    newSkill.values[newSkill.values.length - 1] = 1; // Set diagonal value to 1
    const updatedSkillsData = [...skillsData, newSkill];
    
    // Recalculate percentages and normalized values
    const totalSum = updatedSkillsData.reduce((acc, row) => acc + row.total, 0);
    updatedSkillsData.forEach(row => {
        row.percent = parseFloat(((row.total / totalSum) * 100).toFixed(2));
        row.normalized = parseFloat((row.total / totalSum).toFixed(2));
    });
    setSkillsData(updatedSkillsData);
    };

  // Find the highest percentage value
const highestPercent = Math.max(...skillsData.map(row => row.percent));

  // Chart data
const chartData = {
    labels: skillsData.map(row => row.skill),
    datasets: [
    {
        label: 'Percentage',
        data: skillsData.map(row => row.percent),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
    },
    ],
};

const chartOptions = {
    responsive: true,
    plugins: {
    legend: {
        position: 'top',
    },
    title: {
        display: true,
        text: 'Skills Percentage',
    },
    },
    scales: {
    y: {
        beginAtZero: true,
        ticks: {
        callback: function(value) {
            return value + "%";
        }
        }
    },
    },
};

return (
    <div className="container mx-auto mt-8 p-4">
    <div className="mb-4">
        <button onClick={() => addSkill('New Skill')} className="bg-blue-500 text-white px-4 py-2 rounded">Add Skill</button>
    </div>
    <table className="min-w-full bg-white mb-8">
        <thead>
        <tr>
            <th className="py-2 px-4 border">Skills</th>
            {skillsData.map((row, colIndex) => (
                <th key={colIndex} className="py-2 px-4 border">{row.skill}</th>
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
                <td key={colIndex} className={`py-2 px-4 border ${rowIndex === colIndex ? 'bg-green-200' : (rowIndex > colIndex ? 'bg-blue-200' : 'bg-yellow-200')}`}>
                <input
                    type="number"
                    value={rowIndex === colIndex ? 1 : value}
                    onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
                    disabled={rowIndex > colIndex} // Disable input for cells below and to the left of diagonal
                    className="w-full text-center"
                />
                </td>
            ))}
            <td className="py-2 px-4 border">{row.total}</td>
            <td className={`py-2 px-4 border ${row.percent === highestPercent ? 'font-bold text-red-500' : 'text-red-500'}`}>
                {row.percent}%
            </td>
            <td className="py-2 px-4 border">{row.normalized}</td>
            </tr>
        ))}
        </tbody>
        <tfoot>
        <tr>
            <td className="py-2 px-4 border font-bold">TOTAL</td>
            <td colSpan={skillsData.length} className="py-2 px-4 border font-bold">
            {skillsData.reduce((acc, row) => acc + row.total, 0).toFixed(2)}
            </td>
            <td className="py-2 px-4 border font-bold">100.00</td>
            <td className="py-2 px-4 border font-bold">1.00</td>
        </tr>
        </tfoot>
    </table>

    <Bar data={chartData} options={chartOptions} />
    </div>
);
};

export default Chart;
