import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getDashboard } from "../../services/api";
import YourRoomTabs from "../../components/YourRoomTabs";
import PaintingCard from "../../components/PaintingCard";
import PigmentHeap from "../../components/PigmentHeap";
import Frame from "../../components/Frame";
import Loader from "../../components/Loader";
import EmptyMessage from "../../components/EmptyMessage";
import FadeIn from "../../components/FadeIn";
import { ArrowIcon } from "../../components/Icons";
import TasteBar from "./TasteBar";
import RoomCollections from "./RoomCollections";
import "./Dashboard.css";

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function memberSince(dateText) {
  const date = new Date(dateText);
  return monthNames[date.getMonth()] + " " + date.getFullYear();
}

function Dashboard() {
  const [data, setData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch((error) => setErrorMessage(error.message));
  }, []);

  if (!data) {
    return (
      <section className="dark-section room-loading">
        <div className="container">{errorMessage ? <EmptyMessage title="Your room could not be opened." text={errorMessage} /> : <Loader text="Opening your room." />}</div>
      </section>
    );
  }

  const { user, counts, favouriteRoom, waitingForYou, whereYouHaveBeen, taste, collections } = data;
  const firstName = user.name.split(" ")[0];
  const nothingYet = counts.lookedAt === 0 && counts.saved === 0 && counts.searches === 0;

  return (
    <>
      <section className="dark-section room-top">
        <div className="container room-top-inner">
          <div>
            <p className="small-label">Your room</p>
            <h1 className="page-title">Nice to see you, {firstName}.</h1>
            <p className="room-line">Here's what's been catching your eye, and a few things we think you'll like.</p>
            <YourRoomTabs />
          </div>
          <div className="member-card">
            <p className="member-card-logo">ArtMind</p>
            <p className="member-card-name">{user.name}</p>
            <p className="member-card-since">Member since {memberSince(user.memberSince)}</p>
            <span className="member-card-line"></span>
          </div>
        </div>
      </section>
      <section className="stone-section figures-section">
        <div className="container">
          <p className="small-label">Your visits so far</p>
          <div className="figures">
            <div className="figure">
              <p className="figure-number">{counts.lookedAt}</p>
              <p className="figure-text">paintings looked at</p>
            </div>
            <div className="figure">
              <p className="figure-number">{counts.saved}</p>
              <p className="figure-text">saved</p>
            </div>
            <div className="figure">
              <p className="figure-number">{counts.searches}</p>
              <p className="figure-text">searches</p>
            </div>
            <div className="figure">
              <p className="figure-number figure-word">{favouriteRoom || "Not yet"}</p>
              <p className="figure-text">your favourite room</p>
            </div>
          </div>
        </div>
      </section>
      {nothingYet && (
        <section className="dark-section">
          <div className="container">
            <EmptyMessage title="Look around the gallery and this room will start to fill up." text="Open a few paintings, save the ones you like, and come back.">
              <Link to="/gallery" className="btn btn-light">
                Walk into the gallery
              </Link>
            </EmptyMessage>
          </div>
        </section>
      )}
      {waitingForYou.length > 0 && (
        <section className="dark-section">
          <div className="container">
            <p className="small-label">Waiting for you</p>
            <div className="waiting-grid">
              {waitingForYou.map((item) => (
                <div key={item.painting.slug}>
                  <PaintingCard painting={item.painting} />
                  <p className="waiting-reason">{item.reason}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      {whereYouHaveBeen.length > 0 && (
        <FadeIn>
          <section className="stone-section">
            <div className="container">
              <p className="small-label">Where you've been</p>
              <div className="been-row">
                {whereYouHaveBeen.map((item) => (
                  <Link key={item.painting.slug} to={"/painting/" + item.painting.slug} className="been-item">
                    <Frame image={item.painting.thumb} title={item.painting.title} artist={item.painting.artist} />
                    <p className="been-title">{item.painting.title}</p>
                    <p className="been-when">{item.when}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </FadeIn>
      )}
      {(taste.rooms.length > 0 || taste.colours.length > 0) && (
        <FadeIn>
          <section className="dark-section">
            <div className="container taste-inner">
              <div>
                <p className="small-label">Your taste</p>
                <h2 className="taste-title">Rooms you spend time in</h2>
                <TasteBar rooms={taste.rooms} />
              </div>
              <div className="taste-colours">
                <h2 className="taste-title">Colours you're drawn to</h2>
                <div className="taste-heaps">
                  {taste.colours.map((colour) => (
                    <PigmentHeap key={colour.name} name={colour.name} hex={colour.hex} percent={colour.percent} />
                  ))}
                </div>
              </div>
            </div>
          </section>
        </FadeIn>
      )}
      <section className="stone-section">
        <div className="container">
          <p className="small-label">Your collections</p>
          <RoomCollections collections={collections} />
          <Link to="/collections" className="text-link room-all-link">
            See every collection <ArrowIcon size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}

export default Dashboard;
