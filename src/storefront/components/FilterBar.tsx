"use client";

import { useTranslations } from 'next-intl';

export function FilterBar({ resultCount }: { resultCount: number }) {
  const t = useTranslations('filter');

  return (
    <>
      <div className="filter-bar">
        <span className="filter-label">{t('label')}</span>
        <button className="filter-chip active">{t('all')}</button>
        <button className="filter-chip">{t('new')}</button>
        <button className="filter-chip">{t('sale')}</button>
        <button className="filter-chip">Size S</button>
        <button className="filter-chip">Size M</button>
        <button className="filter-chip">Size L</button>
        <button className="filter-chip">Under $100</button>
        <button className="filter-chip">$100–$300</button>
        <div className="filter-right">
          <select className="sort-select">
            <option value="new">{t('sortNew')}</option>
            <option value="priceasc">{t('sortPriceAsc')}</option>
            <option value="pricedesc">{t('sortPriceDesc')}</option>
            <option value="rating">{t('sortRating')}</option>
          </select>
        </div>
      </div>
      <div className="results-bar">
        <span id="result-count" className="result-count">{t('items', { count: resultCount })}</span>
      </div>
    </>
  );
}
