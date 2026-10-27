import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { searchBySentence } from "../../services/api";
import PaintingCard from "../../components/PaintingCard";
import Loader from "../../components/Loader";
import EmptyMessage from "../../components/EmptyMessage";
import { SearchIcon } from "../../components/Icons";
import UnderstoodTags from "./UnderstoodTags";
import TryThese from "./TryThese";
import "./SearchResults.css";

const defaultSuggestions = ["a stormy sea in the 1800s", "gold, gold and more gold", "a painting with a dog in it somewhere", "something blue and calm"];

function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sentence = (searchParams.get("q") || "").trim();
  const [typed, setTyped] = useState(sentence);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setTyped(sentence);
  }, [sentence]);

  useEffect(() => {
    if (!sentence) {
      setResults(null);
      return undefined;
    }
    let ignore = false;
    async function run() {
      setLoading(true);
      setErrorMessage("");
      try {
        const data = await searchBySentence(sentence);
        if (!ignore) {
          setResults(data);
        }
      } catch (error) {
        if (!ignore) {
          setResults(null);
          setErrorMessage(error.message);
        }
      }
      if (!ignore) {
        setLoading(false);
      }
    }
    run();
    return () => {
      ignore = true;
    };
  }, [sentence]);

  function goSearch(text) {
    const clean = text.trim();
    navigate(clean ? "/search?q=" + encodeURIComponent(clean) : "/search");
  }

  function handleSubmit(event) {
    event.preventDefault();
    goSearch(typed);
  }

  function removePart(index) {
    const rest = results.parts.filter((part, position) => position !== index).map((part) => part.text);
    goSearch(rest.join(" "));
  }

  const items = results ? results.items : [];
  const suggestions = results && results.suggestions && results.suggestions.length ? results.suggestions : defaultSuggestions;
  const countText = items.length === 1 ? "1 painting matches" : items.length + " paintings match";

  return (
    <>
      <section className="dark-section search-top">
        <div className="container">
          <p className="small-label">Search</p>
          <form className="search-field" onSubmit={handleSubmit} role="search">
            <SearchIcon size={24} />
            <input
              type="text"
              className="search-input"
              placeholder="Tell us what you'd like to see, like a stormy sea at sunset."
              aria-label="What would you like to see?"
              value={typed}
              onChange={(event) => setTyped(event.target.value)}
            />
            <button type="submit" className="search-go">
              Search
            </button>
          </form>
          {results && results.parts.length > 0 && <UnderstoodTags parts={results.parts} onRemove={removePart} />}
        </div>
      </section>
      <section className="stone-section results-section">
        <div className="container">
          {!sentence && <EmptyMessage title="What would you like to see?" text="Type a few words above, or try one of the sentences below." />}
          {loading && <Loader text="Looking through the rooms." />}
          {errorMessage && <p className="error-text">{errorMessage}</p>}
          {!loading && sentence && results && items.length === 0 && (
            <EmptyMessage title="Nothing matched that." text="Try fewer words, or one of these." />
          )}
          {!loading && items.length > 0 && (
            <>
              <p className="small-label">{countText}</p>
              <div className="results-grid">
                {items.map((painting) => (
                  <div key={painting.slug} className="result-item">
                    <PaintingCard painting={painting} />
                    <p className="result-why">{painting.why}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
      <TryThese sentences={suggestions} onPick={goSearch} />
    </>
  );
}

export default SearchResults;
