import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import "../../../UI/Chart/Chart.css";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

const StackChart = ({  projectGraph = [] }) => {
  const [chartData, setChartData] = useState({
    ongoing: [],
    completed: [],
    onHold: [],
    labels: [],
  });

  useEffect(() => {
    if (projectGraph.length > 0) {
      const labels = projectGraph.map((item) =>
        new Date(item.date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
        })
      );

      const ongoing = projectGraph.map((item) => item.ongoing || 0);
      const completed = projectGraph.map((item) => item.completed || 0);
      const onHold = projectGraph.map((item) => item.on_hold || 0);

      setChartData({ labels, ongoing, completed, onHold });
    } else {
      setChartData({ labels: [], ongoing: [], completed: [], onHold: [] });
    }
  }, [projectGraph]);

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: "Ongoing",
        data: chartData.ongoing,
        backgroundColor: "#007C2E",
        borderWidth: 1,
        stack: "Stack 0",
      },
      {
        label: "Completed",
        data: chartData.completed,
        backgroundColor: "#7FFF00",
        borderWidth: 1,
        stack: "Stack 0",
      },
      {
        label: "On Hold",
        data: chartData.onHold,
        backgroundColor: "#ADFF2F",
        borderWidth: 1,
        stack: "Stack 0",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
    },
    scales: {
      x: { stacked: true },
      y: {
        stacked: true,
        beginAtZero: true,
        ticks: {
          stepSize: 5,
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default StackChart;
