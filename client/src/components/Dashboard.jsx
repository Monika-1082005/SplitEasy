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
import pendingPayment from "../data/PendingPayment.json";
import settledPayment from "../data/SettledPayment.json";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
);

// Function to format dates from "dd-mm-yyyy" to "yyyy-mm-dd"
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const [dd, mm, yyyy] = dateStr.split("-");
  return `${yyyy}-${mm}-${dd}`; 
};

// Extract and format dates for pending and settled payments
const pendingData = pendingPayment.map((data) => ({
  date: formatDate(data.Date),
  amount: data.Amount,
}));

const settledData = settledPayment.map((data) => ({
  date: formatDate(data.Date),
  amount: data.Amount,
}));

// Combine all dates and sort them
const allDates = [
  ...new Set([...pendingData, ...settledData].map((d) => d.date)),
].sort((a, b) => new Date(a) - new Date(b));

const Dashboard = () => {
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
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
      value: "100",
      icon: <FaClipboardList className="text-blue-500 text-3xl" />,
    },
    {
      title: "Pending Payments",
      value: "40",
      icon: <FaClock className="text-yellow-500 text-3xl" />,
    },
    {
      title: "Settled Payments",
      value: "60",
      icon: <FaCheckCircle className="text-green-500 text-3xl" />,
    },
  ];

  // Creating datasets for the line graph
  const lineChartData = {
    labels: allDates,
    datasets: [
      {
        label: "Pending Payments",
        data: allDates.map((date) => {
          const found = pendingData.find((d) => d.date === date);
          return found ? found.amount : 0;
        }),
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.4,
      },
      {
        label: "Settled Payments",
        data: allDates.map((date) => {
          const found = settledData.find((d) => d.date === date);
          return found ? found.amount : 0;
        }),
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
        data: [
          pendingData.reduce((sum, item) => sum + item.amount, 0),
          settledData.reduce((sum, item) => sum + item.amount, 0),
        ],
        backgroundColor: ["rgba(255, 99, 132, 0.8)", "rgba(20, 131, 235, 0.8)"], 
        borderColor: ["rgba(255, 99, 132, 1)", "rgba(20, 131, 235, 1)"],
      },
    ],
  };

  return (
    <div className="p-4 bg-blue-100">
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
