import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { GuideContext } from "../../context/GuideContext";
import { getHome } from "../../services/api";
import LookCloser from "../../components/LookCloser";
import Loader from "../../components/Loader";
import EmptyMessage from "../../components/EmptyMessage";
import FadeIn from "../../components/FadeIn";
import { ArrowIcon } from "../../components/Icons";
import HomeHero from "./HomeHero";
import RoomDoors from "./RoomDoors";
import MainWall from "./MainWall";
import ColourPicker from "./ColourPicker";
import ThroughTime from "./ThroughTime";
import HomePanels from "./HomePanels";
import FreePass from "./FreePass";
import "./Home.css";

function Home() {
  const { openGuide } = useContext(GuideContext);
  const [home, setHome] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    getHome()
      .then(setHome)
      .catch((error) => setErrorMessage(error.message));
  }, []);

  if (!home) {
    return (
      <section className="dark-section home-loading">
        <div className="container">{errorMessage ? <EmptyMessage title="The gallery doors are stuck." text={errorMessage} /> : <Loader text="Opening the doors." />}</div>
      </section>
    );
  }

  return (
    <>
      <HomeHero painting={home.hero} onAsk={() => openGuide(null)} />
      <FadeIn>
        <section className="stone-section">
          <div className="container">
            <p className="small-label">The rooms</p>
            <h2 className="section-title">Where would you like to start?</h2>
            <RoomDoors rooms={home.rooms} />
          </div>
        </section>
      </FadeIn>
      <FadeIn>
        <section className="dark-section">
          <div className="container">
            <p className="small-label">On the main wall</p>
            <h2 className="section-title">What everyone is looking at this week</h2>
            <MainWall paintings={home.mainWall} />
          </div>
        </section>
      </FadeIn>
      {home.lookCloser && (
        <FadeIn>
          <section className="stone-section">
            <div className="container">
              <p className="small-label">Look closer</p>
              <h2 className="section-title">There is more in {home.lookCloser.title} than you think</h2>
              <LookCloser painting={home.lookCloser} />
              <Link to={"/painting/" + home.lookCloser.slug} className="text-link home-story-link">
                Read the whole story <ArrowIcon size={16} />
              </Link>
            </div>
          </section>
        </FadeIn>
      )}
      <FadeIn>
        <section className="dark-section">
          <div className="container">
            <p className="small-label">By colour</p>
            <h2 className="section-title">Pick a colour and see who loved it most</h2>
            <ColourPicker colours={home.colours} />
          </div>
        </section>
      </FadeIn>
      <section className="stone-section">
        <div className="container">
          <p className="small-label">Through time</p>
          <h2 className="section-title">Six hundred years in one scroll</h2>
          <ThroughTime stops={home.throughTime} />
        </div>
      </section>
      <FadeIn>
        <HomePanels onAsk={() => openGuide(null)} />
      </FadeIn>
      <FreePass painting={home.regular} />
    </>
  );
}

export default Home;
