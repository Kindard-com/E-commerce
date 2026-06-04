"use client";

export function FilterBar({ resultCount }: { resultCount: number }) {
  return (
    <>
      <div className="filter-bar">
        <span className="filter-label">Filter:</span>
        <button className="filter-chip active">All</button>
        <button className="filter-chip">New</button>
        <button className="filter-chip">Sale</button>
        <button className="filter-chip">Size S</button>
        <button className="filter-chip">Size M</button>
        <button className="filter-chip">Size L</button>
        <button className="filter-chip">Under $100</button>
        <button className="filter-chip">$100–$300</button>
        <div className="filter-right">
          <select className="sort-select">
            <option value="new">Sort: New in</option>
            <option value="priceasc">Sort: Price ↑</option>
            <option value="pricedesc">Sort: Price ↓</option>
            <option value="rating">Sort: Rating</option>
          </select>
        </div>
      </div>
      <div className="results-bar">
        <span id="result-count" className="result-count">{resultCount} items</span>
      </div>
    </>
  );
}
