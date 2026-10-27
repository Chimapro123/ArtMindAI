import YourRoomTabs from "../../components/YourRoomTabs";
import "./Dashboard.css";

function Dashboard() {
  return (
    <section className="dark-section dashboard-page">
      <div className="container">
        <h1 className="page-title">Dashboard</h1>
        <YourRoomTabs />
      </div>
    </section>
  );
}

export default Dashboard;
