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

const PieGraph = ({
  labels = ["Stock", "Old Stock", "New Stock"],
  values = [30, 30, 40],
  colors = ["#0D7F20", "#57B94B", "#8CDB32"],
}) => {
  // Convert hex colors to RGBA (for background and border)
  const rgba = (hex, opacity) => {
    const bigint = parseInt(hex.replace("#", ""), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const backgroundColor = colors.map(color => rgba(color, 0.8));
  const borderColor = colors.map(color => rgba(color, 1));

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Inventory Distribution",
        data: values,
        backgroundColor,
        borderColor,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Inventory Distribution",
      },
    },
  };

  return <Doughnut data={data} options={options} />;
};

export default PieGraph;
