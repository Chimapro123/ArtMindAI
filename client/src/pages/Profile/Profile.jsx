import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { getProfile, getPainting } from "../../services/api";
import YourRoomTabs from "../../components/YourRoomTabs";
import Frame from "../../components/Frame";
import Loader from "../../components/Loader";
import AboutYouForm from "./AboutYouForm";
import PasswordForm from "./PasswordForm";
import EmailSwitches from "./EmailSwitches";
import ClosePass from "./ClosePass";
import "./Profile.css";

function Profile() {
  const { user, setUser } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [cover, setCover] = useState(null);

  useEffect(() => {
    getProfile()
      .then((data) => setProfile(data.user))
      .catch(() => setProfile(user));
    getPainting("salisbury-cathedral-from-the-meadows")
      .then((data) => setCover(data.painting))
      .catch(() => setCover(null));
  }, [user]);

  function updateUser(newUser) {
    setProfile(newUser);
    setUser(newUser);
  }

  if (!profile) {
    return (
      <section className="dark-section profile-loading">
        <div className="container">
          <Loader text="Finding your details." />
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="dark-section profile-top">
        <div className="container profile-top-inner">
          <div>
            <p className="small-label">Your room</p>
            <h1 className="page-title">Your details</h1>
            <p className="profile-line">Change how you appear, what you like, and how you sign in.</p>
            <YourRoomTabs />
          </div>
          {cover && (
            <div className="profile-cover">
              <div className="profile-glow"></div>
              <Link to={"/painting/" + cover.slug} className="profile-cover-frame">
                <Frame image={cover.image} title={cover.title} artist={cover.artist} />
              </Link>
            </div>
          )}
        </div>
      </section>
      <section className="stone-section">
        <div className="container">
          <p className="small-label">About you</p>
          <AboutYouForm user={profile} onUpdate={updateUser} />
        </div>
      </section>
      <section className="dark-section">
        <div className="container">
          <p className="small-label">Your password</p>
          <h2 className="profile-heading">Pick something you don't use anywhere else.</h2>
          <PasswordForm />
        </div>
      </section>
      <section className="stone-section">
        <div className="container">
          <p className="small-label">Emails from us</p>
          <EmailSwitches user={profile} onUpdate={updateUser} />
        </div>
      </section>
      <section className="dark-section">
        <div className="container">
          <p className="small-label">Closing your pass</p>
          <ClosePass />
        </div>
      </section>
    </>
  );
}

export default Profile;
