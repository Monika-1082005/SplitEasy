import { FaClipboardList, FaClock, FaCheckCircle } from "react-icons/fa";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  PointElement,
  ArcElement,
} from "chart.js";

import { Doughnut, Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
);

const apiUrl = import.meta.env.VITE_API_URL;
const Dashboard = () => {
  const [splitCount, setSplitCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [settledCount, setSettledCount] = useState(0);
  const [timelineData, setTimelineData] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      axios
        .get(`${apiUrl}/user-split-count`, {
          params: { userId },
        })
        .then((res) => {
          if (res.data.success) {
            setSplitCount(res.data.count);
          } else {
            toast.error("Failed to load split count", { autoClose: 2000 });
          }
        })
        .catch((err) => {
          console.error("Split count error:", err);
          toast.error("Something went wrong", { autoClose: 2000 });
        });

      // Fetch pending and settled payment counts
      axios
        .get(`${apiUrl}/user-payment-stats`, { params: { userId } })
        .then((res) => {
          if (res.data.success) {
            setPendingCount(res.data.pending);
            setSettledCount(res.data.settled);
          } else {
            toast.error("Failed to load payment stats", { autoClose: 2000 });
          }
        })
        .catch((err) => {
          console.error("Payment stats error:", err);
          toast.error("Something went wrong", { autoClose: 2000 });
        });

      axios
        .get(`${apiUrl}/user-payment-timeline`, { params: { userId } })
        .then((res) => {
          if (res.data.success) {
            setTimelineData(res.data.timeline);
          }
        })
        .catch((err) => {
          console.error("Timeline stats error:", err);
        });
    }
  }, []);

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 10, // Tick steps every 10
          precision: 0, // No decimals
          callback: function (value) {
            return Number.isInteger(value) ? value : null;
          },
        },
        suggestedMax: 50,
      },
    },
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  const cards = [
    {
      title: "Total Splits Created",
      value: splitCount.toString(),
      icon: <FaClipboardList className="text-blue-500 text-3xl" />,
    },
    {
      title: "Pending Payments",
      value: pendingCount.toString(),
      icon: <FaClock className="text-yellow-500 text-3xl" />,
    },
    {
      title: "Settled Payments",
      value: settledCount.toString(),
      icon: <FaCheckCircle className="text-green-500 text-3xl" />,
    },
  ];

  // Creating datasets for the line graph
  const allDates = timelineData.map((entry) => entry.date);

  const lineChartData = {
    labels: allDates,
    datasets: [
      {
        label: "Pending Payments",
        data: timelineData.map((entry) => entry.pending),
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.4,
      },
      {
        label: "Settled Payments",
        data: timelineData.map((entry) => entry.settled),
        borderColor: "rgba(20, 131, 235, 1)",
        backgroundColor: "rgba(20, 131, 235, 0.2)",
        tension: 0.4,
      },
    ],
  };

  // Creating datasets for the doughnut chart
  const doughnutChartData = {
    labels: ["Pending Payments", "Settled Payments"],
    datasets: [
      {
        data: [pendingCount, settledCount],
        backgroundColor: [
          "rgba(255, 99, 132, 0.8)", // Red for Pending
          "rgba(20, 131, 235, 0.8)", // Blue for Settled
        ],
        borderColor: ["rgba(255, 99, 132, 1)", "rgba(20, 131, 235, 1)"],
      },
    ],
  };

  return (
    <div className="p-4 bg-indigo-100">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map((card, index) => (
          <div
            key={index}
            className="p-10 bg-white rounded-lg shadow-lg flex items-center gap-4 border-gray-200"
          >
            {card.icon}
            <div>
              <p className="text-[#1F3C9A] text-lg">{card.title}</p>
              <h2 className="text-2xl font-semibold">{card.value}</h2>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
        {/* Line Graph */}
        <div
          className="p-4 bg-white rounded-lg shadow-lg flex items-center border border-gray-200"
          style={{ width: "100%", height: "400px" }}
        >
          <Line data={lineChartData} options={lineChartOptions} />
        </div>

        {/* Doughnut Chart */}
        <div
          className="p-6 bg-white rounded-lg shadow-md border border-gray-200"
          style={{ height: "400px" }}
        >
          <Doughnut data={doughnutChartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
