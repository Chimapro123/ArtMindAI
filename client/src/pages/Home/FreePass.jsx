import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Frame from "../../components/Frame";
import { ArrowIcon } from "../../components/Icons";
import "./FreePass.css";

function FreePass({ painting }) {
  const { user } = useContext(AuthContext);

  return (
    <section className="stone-section free-pass">
      <div className="container free-pass-inner">
        <div>
          {user ? (
            <>
              <p className="small-label">Welcome back</p>
              <h2 className="free-pass-title">Good to see you again, {user.name.split(" ")[0]}.</h2>
              <p className="free-pass-text">Your room has a few new things waiting in it since last time.</p>
              <Link to="/dashboard" className="btn btn-dark">
                Go to your room <ArrowIcon size={16} />
              </Link>
            </>
          ) : (
            <>
              <p className="small-label">Free pass</p>
              <h2 className="free-pass-title">Become a regular</h2>
              <p className="free-pass-text">Save the paintings you love, build your own collections, and find a few new ones waiting for you each time you come back.</p>
              <Link to="/join" className="btn btn-dark">
                Get your free pass
              </Link>
            </>
          )}
        </div>
        {painting && (
          <Link to={"/painting/" + painting.slug} className="free-pass-picture">
            <Frame image={painting.image} title={painting.title} artist={painting.artist} />
          </Link>
        )}
      </div>
    </section>
  );
}

export default FreePass;
