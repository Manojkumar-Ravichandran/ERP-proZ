import React from "react";
import { Line } from "react-chartjs-2";
import './Chart.css'
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const Chart = () => {
  // Line chart data
  const data = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "Sales",
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: "#00b300",
        tension: 0.1, // Line tension (curvature)
      },
      {
        label: "Expenses",
        data: [28, 48, 40, 19, 86, 27, 90],
        fill: false,
        borderColor: "#0066ff",
        tension: 0.1,
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
        text: "Sales vs Expenses Over Time",
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

  return <Line data={data} options={options} />;
};

export default Chart;
