import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const DasboardBarChart = ({ data }) => {
    console.log("data",data)
  // Process data dynamically
  const labels = data.map((entry) => entry.date);
  const materialsData = data.map((entry) => entry.material_in + entry.material_out);
  const assetsData = data.map((entry) => entry.assets_in + entry.assets_out);

  // Bar chart data
  const chartData = {
    labels,
    datasets: [
      {
        label: "Materials",
        data: materialsData,
        backgroundColor: "rgba(13, 127, 32, 0.8)",
        borderColor: "rgba(13, 127, 32, 1)",
        borderWidth: 1,
      },
      {
        label: "Assets",
        data: assetsData,
        backgroundColor: "rgba(87, 185, 75, 0.8)",
        borderColor: "rgba(87, 185, 75, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Materials vs Assets Over Time",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        title: {
          display: true,
          text: "Amount",
        },
        beginAtZero: true,
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default DasboardBarChart;
