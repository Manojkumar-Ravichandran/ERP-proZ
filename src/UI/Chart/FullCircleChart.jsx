import React from "react";
import { Pie } from "react-chartjs-2";
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

const FullCircleChart = () => {
  // Pie chart data
  const data = {
    labels: ["Occupied", "Unoccupied"],
    datasets: [
      {
        label: "Space Usage",
        data: [70, 30], // Example data: 70% occupied, 30% unoccupied
        backgroundColor: ["rgba(13, 127, 32, 0.8)", "rgba(87, 185, 75, 0.8)"],
        borderColor: ["rgba(13, 127, 32, 1)", "rgba(87, 185, 75, 1)"],
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
        text: "Occupied vs Unoccupied Space",
      },
    },
  };

  return <Pie data={data} options={options} />;
};

export default FullCircleChart;
