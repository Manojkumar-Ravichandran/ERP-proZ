import { React, useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import "../../../UI/Chart/Chart.css";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { crmDashboard } from "../../../redux/CRM/lead/LeadEffects";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, Title);

const ProjectChart = ({ selectedDate }) => {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    if (selectedDate) {
      fetchDashboardData(selectedDate); // Fetch data based on selectedDate
    } else {
      setDashboardData(null); // Set data to null if no date is selected
    }
  }, [selectedDate]); // Re-fetch whenever selectedDate changes

  const fetchDashboardData = (date) => {
    const formattedDate = formatDateForAPI(date); // Format the selected date

    crmDashboard({ date: formattedDate })
      .then((response) => {
        if (response.data && response.data.status === "success") {
          setDashboardData(response.data.data);
        } else {
          setDashboardData(null); // Set data to null if no data is available
        }
      })
      .catch((error) => {
        console.error("Error fetching CRM dashboard data:", error);
        setDashboardData(null); // Set data to null in case of an error
      });
  };

  // Function to format the date from YYYY-MM-DD to DD-MM-YYYY for the API
  const formatDateForAPI = (date) => {
    const dateParts = date.split('-'); // Split by dash (YYYY-MM-DD)
    return date ? `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}` : ''; // Return as DD-MM-YYYY or empty string
  };

  // Doughnut chart data
  const data = {
    labels: ["Total Project", "New Project"],
    datasets: [
      {
        label: "Projects",
        data: [
          dashboardData?.totalpleads || 0, 
          dashboardData?.totalnewPleads || 0
        ],
        backgroundColor: [
          "rgba(13, 127, 32, 1)",
          "rgba(139, 219, 50, 1)",
        ],
        borderColor: [
          "rgba(13, 127, 32, 0.6)",
          "rgba(139, 219, 50, 0.6)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    layout: {},
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          padding: 20,
        },
      },
    },
  };

  return <Doughnut data={data} options={options} />;
};

export default ProjectChart;
