import React from 'react'
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const SaleLineChart = ({ saleHistory }) => {
    if (!Array.isArray(saleHistory) || saleHistory.length === 0) {
        return <p>No sales data</p>;
    }
    const sortedSales = [...saleHistory].sort((a, b) => new Date(a.date) - new Date(b.date));
    const labels = sortedSales.map((sale) => new Date(sale.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }))
    const dataPoints = sortedSales.map((sale) => sale.price)

    const data = {
        labels,
        datasets: [
            {
                label: "Sale Price ($)",
                data: dataPoints,
                borderColor: "rgba(75,192,192,1)",
                backgroundColor: "rgba(75,192,192,0.2)",
                tension: 0.3,
                fill: true,
                pointRadius: 5,
            }
        ]
    };
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: context => `$${context.raw}`,
                },
            },
        },
        scales: {
            x: {
                ticks: { color: "white" },
                grid: { color: "rgba(255,255,255,0.1)" },
            },
            y: {
                ticks: { color: "white" },
                grid: { color: "rgba(255,255,255,0.1)" },
            },
        },
    };
    return (
        <div>
            <Line data={data} options={options} />
        </div>
    )
}

export default SaleLineChart