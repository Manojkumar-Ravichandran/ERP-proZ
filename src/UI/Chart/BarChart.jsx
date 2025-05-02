import React from "react";
import { Bar } from "react-chartjs-2";
import './Chart.css';
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
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const BarChart = () => {
  // Bar chart data
  const data = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "Materials",
        data: [50, 70, 60, 90, 80, 100, 70],
        backgroundColor: "rgba(13, 127, 32, 0.8)",
        borderColor: "rgba(13, 127, 32, 1)",
        borderWidth: 1,
      },
      {
        label: "Assets",
        data: [30, 40, 50, 60, 70, 80, 90],
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
          text: "Months",
        },
      },
      y: {
        title: {
          display: true,
          text: "Amount (in USD)",
        },
        beginAtZero: true, // Start y-axis at 0
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default BarChart;
