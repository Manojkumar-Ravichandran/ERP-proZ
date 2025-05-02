import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import "../../../UI/Chart/Chart.css";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { crmDashboard } from "../../../redux/CRM/lead/LeadEffects";

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

const StackChart = ({ selectedDate }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [formattedLabels, setFormattedLabels] = useState(null);

  useEffect(() => {
    if (selectedDate) {
      fetchDashboardData(selectedDate);
    } else {
      // Handle the case when selectedDate is empty, set empty data or placeholder data
      setDashboardData({
        Existing: [],
        new: [],
        won: [],
        lost: [],
        open: [],
      });
      setFormattedLabels([]);
    }
  }, [selectedDate]);

  const fetchDashboardData = (date) => {
    const formattedDate = formatDateForAPI(date);

    crmDashboard({ date: formattedDate })
      .then((response) => {
        if (response.data && response.data.status === "success") {
          setDashboardData(response.data.data.reportData);
          const formatted = response.data.data.labels.map((dateStr) => {
            const dateObj = new Date(dateStr);
            return dateObj.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
            });
          });

          setFormattedLabels(formatted);
        } else {
          setDashboardData({
            Existing: [],
            new: [],
            won: [],
            lost: [],
            open: [],
          });
          setFormattedLabels([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching CRM dashboard data:", error);
        setDashboardData({
          Existing: [],
          new: [],
          won: [],
          lost: [],
          open: [],
        });
        setFormattedLabels([]);
      });
  };

  // Function to format the date from YYYY-MM-DD to DD-MM-YYYY for the API
  const formatDateForAPI = (date) => {
    const dateParts = date.split("-");
    return date ? `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}` : ""; // Handle empty date
  };

  const data = {
    labels: formattedLabels || [], // Fallback to empty array if formattedLabels is null
    datasets: [
      {
        label: "Existing",
        data: dashboardData?.overall || [],
        backgroundColor: "rgba(13, 127, 32, 1)",
        borderColor: "rgba(13, 127, 32, 0.6)",
        borderWidth: 1,
        stack: "Stack 0",
      },
      {
        label: "New",
        data: dashboardData?.new || [],
        backgroundColor: "rgba(87, 185, 75, 1)",
        borderColor: "rgba(87, 185, 75, 0.6)",
        borderWidth: 1,
        stack: "Stack 1",
      },
      {
        label: "Won",
        data: dashboardData?.won || [],
        backgroundColor: "rgba(152, 247, 7, 1)",
        borderColor: "rgba(152, 247, 7, 0.6)",
        borderWidth: 1,
        stack: "Stack 1",
      },
      {
        label: "Lost",
        data: dashboardData?.lost || [],
        backgroundColor: "rgba(128, 128, 128, 1)",
        borderColor: "rgba(128, 128, 128, 0.6)",
        borderWidth: 1,
        stack: "Stack 1",
      },
      {
        label: "Open",
        data: dashboardData?.open || [],
        backgroundColor: "rgba(50, 205, 50, 1)",
        borderColor: "rgba(50, 205, 50, 0.6)",
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
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        // min: 0,
        // max: 90,
        // ticks: {
        //   stepSize: 10,
        //   callback: function (value) {
        //     return value + " leads";
        //   },
        // },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default StackChart;
