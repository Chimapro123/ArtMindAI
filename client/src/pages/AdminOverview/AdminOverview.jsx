import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAdminOverview } from "../../services/api";
import Loader from "../../components/Loader";
import EmptyMessage from "../../components/EmptyMessage";
import VisitsChart from "./VisitsChart";
import RoomsChart from "./RoomsChart";
import "./AdminOverview.css";

const rangeWords = { week: "last week", month: "last month", year: "last year" };
const rangeNames = { week: "this week", month: "this month", year: "this year" };
const figureNames = [
  { key: "visits", text: "visitors," },
  { key: "pageViews", text: "pages opened," },
  { key: "paintingViews", text: "paintings opened," },
  { key: "saves", text: "paintings saved," },
  { key: "searches", text: "searches," },
  { key: "questions", text: "questions to the guide," },
  { key: "labPhotos", text: "photos in the Image Lab," },
  { key: "newPasses", text: "new passes," },
  { key: "messages", text: "messages sent," },
  { key: "subscribers", text: "new subscribers," }
];

function changeText(change, range) {
  if (change === null || change === undefined) {
    return "nothing to compare with yet.";
  }
  if (change === 0) {
    return "level with " + rangeWords[range] + ".";
  }
  return (change > 0 ? "up " : "down ") + Math.abs(change) + "% on " + rangeWords[range] + ".";
}

function AdminOverview() {
  const [range, setRange] = useState("week");
  const [data, setData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let ignore = false;
    setData(null);
    setErrorMessage("");
    getAdminOverview(range)
      .then((result) => {
        if (!ignore) {
          setData(result);
        }
      })
      .catch((error) => {
        if (!ignore) {
          setErrorMessage(error.message);
        }
      });
    return () => {
      ignore = true;
    };
  }, [range]);

  const figures = data
    ? figureNames.map((item) => ({
        number: data.figures[item.key],
        text: item.text,
        change: changeText(data.changes[item.key], range)
      }))
    : [];

  return (
    <div className="overview-page">
      <div className="overview-head">
        <h1 className="overview-title">How the gallery is doing</h1>
        <select className="overview-range" value={range} aria-label="Which period" onChange={(event) => setRange(event.target.value)}>
          <option value="week">This week</option>
          <option value="month">This month</option>
          <option value="year">This year</option>
        </select>
      </div>
      {errorMessage && <EmptyMessage title="The numbers could not be loaded." text={errorMessage} />}
      {!data && !errorMessage && <Loader text="Counting the visitors." />}
      {data && (
        <>
          <div className="overview-figures">
            {figures.map((figure) => (
              <div key={figure.text} className="overview-figure">
                <p className="overview-number">{figure.number.toLocaleString()}</p>
                <p className="overview-text">
                  {figure.text}
                  <br />
                  {figure.change}
                </p>
              </div>
            ))}
          </div>
          <p className="overview-all-time">
            Since the gallery opened: {data.allTime.visits.toLocaleString()} visits, {data.allTime.paintingViews.toLocaleString()} paintings opened, {data.allTime.members.toLocaleString()} members and {data.allTime.paintingsOnWall.toLocaleString()} paintings on the wall.
          </p>
          <div className="overview-boxes">
            <div className="overview-box">
              <h2 className="overview-box-title">Visitors each day</h2>
              <VisitsChart days={data.visitsByDay} />
            </div>
            <div className="overview-box">
              <h2 className="overview-box-title">Time spent in each room</h2>
              {data.timeInRooms.length > 0 ? <RoomsChart rooms={data.timeInRooms} /> : <p className="overview-quiet">Nobody has opened a painting yet.</p>}
            </div>
          </div>
          <h2 className="overview-heading">Most looked at {rangeNames[range]}</h2>
          {data.mostLookedAt.length === 0 && <p className="overview-quiet">Nothing has been looked at yet.</p>}
          {data.mostLookedAt.length > 0 && (
            <table className="overview-table">
              <thead>
                <tr>
                  <th>Painting</th>
                  <th>Artist</th>
                  <th>Views</th>
                  <th>All time</th>
                  <th>Saves</th>
                </tr>
              </thead>
              <tbody>
                {data.mostLookedAt.map((row) => (
                  <tr key={row.painting.slug}>
                    <td className="overview-painting">
                      <img src={row.painting.thumb} alt="" className="overview-thumb" loading="lazy" />
                      <Link to={"/painting/" + row.painting.slug}>{row.painting.title}</Link>
                    </td>
                    <td>{row.painting.artist}</td>
                    <td>{row.views}</td>
                    <td>{row.allTimeViews}</td>
                    <td>{row.saves}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div className="overview-boxes">
            <div className="overview-box">
              <h2 className="overview-box-title">What people searched for</h2>
              {data.searchedFor.length === 0 && <p className="overview-quiet">No searches yet.</p>}
              <ul className="overview-searches">
                {data.searchedFor.map((item) => (
                  <li key={item.sentence}>
                    <span>{item.sentence}</span>
                    <span>{item.count}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="overview-box overview-box-light">
              <h2 className="overview-box-title">Worth knowing</h2>
              {data.notes.map((note) => (
                <p key={note} className="overview-note">
                  {note}
                </p>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminOverview;
