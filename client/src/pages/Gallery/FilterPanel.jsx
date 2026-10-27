import EraSlider from "./EraSlider";
import { pigments } from "./galleryHelpers";
import "./FilterPanel.css";

function ChoiceList({ title, filterKey, choices, picked, onChange }) {
  return (
    <div className="filter-group">
      <p className="small-label filter-title">{title}</p>
      {choices.map((choice) => (
        <label key={choice} className="filter-choice">
          <input type="checkbox" checked={picked === choice} onChange={() => onChange(filterKey, picked === choice ? "" : choice)} />
          <span>{choice}</span>
        </label>
      ))}
    </div>
  );
}

function FilterPanel({ filters, options, onChange, onChangeMany, open, onClose }) {
  const panelClass = "filter-panel" + (open ? " filter-panel-open" : "");

  return (
    <>
      {open && <div className="filter-backdrop" onClick={onClose}></div>}
      <aside className={panelClass} aria-label="Filters">
        <div className="filter-panel-top">
          <p className="filter-panel-heading">Filters</p>
          <button type="button" className="text-link" onClick={onClose}>
            Done
          </button>
        </div>
        <ChoiceList title="Style" filterKey="style" choices={options.styles} picked={filters.style || ""} onChange={onChange} />
        <ChoiceList title="Medium" filterKey="medium" choices={options.mediums} picked={filters.medium || ""} onChange={onChange} />
        <ChoiceList title="Surface" filterKey="surface" choices={options.surfaces} picked={filters.surface || ""} onChange={onChange} />
        <div className="filter-group">
          <p className="small-label filter-title">Colour</p>
          {pigments.map((pigment) => {
            const picked = filters.colour === pigment.name;
            return (
              <button
                key={pigment.name}
                type="button"
                className={"colour-choice" + (picked ? " colour-choice-picked" : "")}
                aria-pressed={picked}
                onClick={() => onChange("colour", picked ? "" : pigment.name)}
              >
                <span className="colour-dot" style={{ backgroundColor: pigment.hex }}></span>
                <span>{pigment.name}</span>
              </button>
            );
          })}
        </div>
        <div className="filter-group">
          <p className="small-label filter-title">Era</p>
          <EraSlider
            min={options.minYear}
            max={options.maxYear}
            from={Number(filters.fromYear) || options.minYear}
            to={Number(filters.toYear) || options.maxYear}
            onChange={(fromYear, toYear) =>
              onChangeMany({
                fromYear: fromYear > options.minYear ? String(fromYear) : "",
                toYear: toYear < options.maxYear ? String(toYear) : ""
              })
            }
          />
        </div>
        <div className="filter-group filter-switches">
          <label className="switch-row">
            <span>Hide paintings I've already seen</span>
            <input type="checkbox" className="switch" checked={filters.hideSeen === "true"} onChange={(event) => onChange("hideSeen", event.target.checked ? "true" : "")} />
          </label>
          <label className="switch-row">
            <span>Curated picks only</span>
            <input type="checkbox" className="switch" checked={filters.curated === "true"} onChange={(event) => onChange("curated", event.target.checked ? "true" : "")} />
          </label>
        </div>
      </aside>
    </>
  );
}

export default FilterPanel;
