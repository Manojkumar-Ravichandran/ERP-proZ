import React from "react";
import { Doughnut } from "react-chartjs-2";
import './Chart.css';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, Title);

const CircleChart = () => {
  // Doughnut chart data
  const data = {
    labels: ["Stock", "Old Stock", "New Stock"],
    datasets: [
      {
        label: "Inventory Distribution",
        data: [30, 30, 40], // Example data: 30% stock, 30% old stock, 40% new stock
        backgroundColor: [
          "rgba(13, 127, 32, 0.8)",  // Stock color
          "rgba(87, 185, 75, 0.8)",  // Old stock color
          "rgba(140, 219, 50, 0.8)",  // New stock color
        ],
        borderColor: [
          "rgba(13, 127, 32, 1)", 
          "rgba(87, 185, 75, 1)", 
          "rgba(140, 219, 50, 1)",
        ],
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
        text: "Inventory Distribution (Stock vs Old Stock vs New Stock)",
      },
    },
  };

  return <Doughnut data={data} options={options} />;
};

export default CircleChart;
