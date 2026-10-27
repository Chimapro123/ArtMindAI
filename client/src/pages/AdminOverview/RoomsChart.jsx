import { Bar } from "react-chartjs-2";
import { themeColours } from "./chartSetup";
import "./RoomsChart.css";

function RoomsChart({ rooms }) {
  const colours = themeColours();
  const data = {
    labels: rooms.map((room) => room.room),
    datasets: [
      {
        data: rooms.map((room) => room.percent),
        backgroundColor: colours.gold,
        hoverBackgroundColor: colours.lightGold,
        barThickness: 14,
        borderRadius: 2
      }
    ]
  };
  const options = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 800 },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: colours.darkWall,
        titleColor: colours.white,
        bodyColor: colours.white,
        callbacks: { label: (item) => item.raw + "%" }
      }
    },
    scales: {
      x: { min: 0, max: 100, grid: { color: colours.line }, ticks: { color: colours.grey, font: { family: colours.textFont, size: 11 }, callback: (value) => value + "%" } },
      y: { grid: { display: false }, ticks: { color: colours.white, font: { family: colours.textFont, size: 13 } } }
    }
  };

  return (
    <div className="rooms-chart" style={{ height: Math.max(160, rooms.length * 38) + "px" }}>
      <Bar data={data} options={options} />
    </div>
  );
}

export default RoomsChart;
