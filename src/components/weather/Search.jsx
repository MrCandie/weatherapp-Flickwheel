import "./weather.css";

export default function Search({ search, setSearch, searchHandler }) {
  return (
    <div className="search">
      <input
        onChange={(e) => setSearch(e.target.value)}
        value={search}
        type="text"
        placeholder="Search Address"
      />
      <button onClick={searchHandler}>
        <img src="/search.png" alt="search" />
      </button>
    </div>
  );
}
