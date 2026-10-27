import YourRoomTabs from "../../components/YourRoomTabs";
import "./Profile.css";

function Profile() {
  return (
    <section className="dark-section profile-page">
      <div className="container">
        <h1 className="page-title">Profile</h1>
        <YourRoomTabs />
      </div>
    </section>
  );
}

export default Profile;
