import { Line } from "react-chartjs-2";
import { themeColours } from "./chartSetup";
import "./VisitsChart.css";

function VisitsChart({ days }) {
  const colours = themeColours();
  const data = {
    labels: days.map((day) => day.day),
    datasets: [
      {
        data: days.map((day) => day.count),
        borderColor: colours.gold,
        backgroundColor: colours.lightGold,
        pointBackgroundColor: colours.lightGold,
        pointBorderColor: colours.gold,
        pointRadius: 4,
        borderWidth: 2,
        tension: 0.3
      }
    ]
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 800 },
    plugins: { legend: { display: false }, tooltip: { backgroundColor: colours.darkWall, titleColor: colours.white, bodyColor: colours.white } },
    scales: {
      x: { grid: { color: colours.line }, ticks: { color: colours.grey, font: { family: colours.textFont, size: 11 } } },
      y: { beginAtZero: true, grid: { color: colours.line }, ticks: { color: colours.grey, font: { family: colours.textFont, size: 11 }, precision: 0 } }
    }
  };

  return (
    <div className="visits-chart">
      <Line data={data} options={options} />
    </div>
  );
}

export default VisitsChart;
