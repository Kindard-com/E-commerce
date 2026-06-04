import { neonDb } from '../lib/db';

export async function Ticker() {
  let tickerText = "NEW DROP: KINDARD SUMMER '26 | FREE SHIPPING OVER $150 | USE CODE: KIND20 FOR 20% OFF | MEMBERS GET EARLY ACCESS";
  
  try {
    const res = await neonDb`SELECT setting_value FROM site_settings WHERE setting_key = 'marketing_banner_text'`;
    if (res.length > 0) {
      tickerText = String(res[0].setting_value);
    }
  } catch (err) {
    // fallback to default
  }

  const segments = tickerText.split('|').map(s => s.trim()).filter(Boolean);

  return (
    <div className="ticker">
      <div className="ticker-inner">
        {segments.map((segment, index) => (
          <span key={index}>{segment}</span>
        ))}
        {segments.map((segment, index) => (
          <span key={`dup1-${index}`}>{segment}</span>
        ))}
        {segments.map((segment, index) => (
          <span key={`dup2-${index}`}>{segment}</span>
        ))}
      </div>
    </div>
  );
}
