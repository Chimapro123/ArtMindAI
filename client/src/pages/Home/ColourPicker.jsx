import { useState } from "react";
import { Link } from "react-router-dom";
import PigmentHeap from "../../components/PigmentHeap";
import { ArrowIcon } from "../../components/Icons";
import "./ColourPicker.css";

function ColourPicker({ colours }) {
  const [picked, setPicked] = useState(0);
  const current = colours[picked];

  if (!current) {
    return null;
  }

  return (
    <div className="colour-picker">
      <div className="colour-heaps">
        {colours.map((colour, index) => (
          <PigmentHeap key={colour.name} name={colour.name} hex={colour.hex} selected={index === picked} onClick={() => setPicked(index)} />
        ))}
      </div>
      <div className="colour-paintings" key={current.name}>
        {current.paintings.slice(0, 6).map((painting) => (
          <Link key={painting.slug} to={"/painting/" + painting.slug} className="colour-painting">
            <img src={painting.thumb} alt={painting.title + " by " + painting.artist} loading="lazy" />
            <span className="colour-painting-title">{painting.title}</span>
          </Link>
        ))}
      </div>
      <Link to={"/gallery?colour=" + encodeURIComponent(current.name)} className="text-link colour-more">
        Everything with {current.name.toLowerCase()} in it <ArrowIcon size={16} />
      </Link>
    </div>
  );
}

export default ColourPicker;
