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

const OverviewChart = ({ selectedDate }) => {
    const [dashboardData, setDashboardData] = useState(null);
    const [formattedLabels, setFormattedLabels] = useState(null);
    const [showMaterial, setShowMaterial] = useState(true);
    const [showAssets, setShowAssets] = useState(true);

    useEffect(() => {
        if (selectedDate) {
            fetchDashboardData(selectedDate);
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
    }, [selectedDate]);

    const fetchDashboardData = (date) => {
        const formattedDate = formatDateForAPI(date);

        crmDashboard({ date: formattedDate })
            .then((response) => {
                if (response.data && response.data.status === "success") {
                    setDashboardData(response.data.data.chartData);
                    const formatted = response.data.data.labels.map((dateStr) => {
                        // console.log("apidata",formatted)
                        const dateObj = new Date(dateStr);
                        return dateObj.toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                        });
                    });

                    setDashboardData({
                        material_in: formatted.map((entry) => entry.material_in),
                        material_out: formatted.map((entry) => entry.material_out),
                        assets_in: formatted.map((entry) => entry.assets_in),
                        assets_out: formatted.map((entry) => entry.assets_out),
                    });

                    setFormattedLabels(formattedLabels);
                } else {
                    setDashboardData({
                        material_in: [],
                        material_out: [],
                        assets_in: [],
                        assets_out: [],
                    });
                    setFormattedLabels([]);
                }
            })
            .catch((error) => {
                console.error("Error fetching CRM dashboard data:", error);
                setDashboardData({
                    material_in: [],
                    material_out: [],
                    assets_in: [],
                    assets_out: [],
                });
                setFormattedLabels([]);
            });
    };

    const formatDateForAPI = (date) => {
        const dateParts = date.split("-");
        return date ? `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}` : "";
    };

    // ✅ Filter datasets based on checkboxes
    const datasets = [
        showMaterial && {
            label: "Material in",
            data: dashboardData?.overall || [],
            backgroundColor: "rgba(13, 127, 32, 1)",
            borderColor: "rgba(13, 127, 32, 0.6)",
            borderWidth: 1,
            stack: "Stack 0",
        },
        showMaterial && {
            label: "Material out",
            data: dashboardData?.new || [],
            backgroundColor: "rgba(87, 185, 75, 1)",
            borderColor: "rgba(87, 185, 75, 0.6)",
            borderWidth: 1,
            stack: "Stack 1",
        },
        showAssets && {
            label: "Assets in",
            data: dashboardData?.won || [],
            backgroundColor: "rgba(152, 247, 7, 1)",
            borderColor: "rgba(152, 247, 7, 0.6)",
            borderWidth: 1,
            stack: "Stack 1",
        },
        showAssets && {
            label: "Assets Out",
            data: dashboardData?.lost || [],
            backgroundColor: "rgba(204, 255, 147, 1)",
            borderColor: "rgba(204, 255, 147, 1)",
            borderWidth: 1,
            stack: "Stack 1",
        },
    ].filter(Boolean); // Remove `false` values from dataset

    const data = {
        labels: formattedLabels || [],
        datasets,
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
            y: { stacked: true },
        },
    };

    return (
        <div>
            {/* ✅ Checkboxes for toggling datasets */}
            <div className="flex gap-4 mb-4 ms-9">
                <label>
                    <input
                        type="checkbox"
                        checked={showMaterial}
                        onChange={() => setShowMaterial(!showMaterial)}
                    />{" "}
                    Material
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={showAssets}
                        onChange={() => setShowAssets(!showAssets)}
                    />{" "}
                    Assets
                </label>
            </div>

            {/* Chart */}
            <Bar data={data} options={options} />
        </div>
    );
};

export default OverviewChart;
