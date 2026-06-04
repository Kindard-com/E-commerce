import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.query.query as string;
  const country = req.query.country as string;

  if (!query) {
    return res.status(400).json({ message: "Missing query parameter" });
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    // Mock response if no API key is provided
    return res.json({
      suggestions: [
        {
          place_id: "mock_1",
          description: `${query} (Mock Suggestion 1)`,
          matched_substrings: [],
        },
        {
          place_id: "mock_2",
          description: `${query} (Mock Suggestion 2)`,
          matched_substrings: [],
        },
      ],
      provider: "mock",
    });
  }

  try {
    const url = new URL("https://maps.googleapis.com/maps/api/place/autocomplete/json");
    url.searchParams.append("input", query);
    url.searchParams.append("types", "address");
    if (country) {
      url.searchParams.append("components", `country:${country.toLowerCase()}`);
    }
    url.searchParams.append("key", apiKey);

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      console.error("Google Places API Error:", data);
      return res.status(500).json({ message: "Address provider error", details: data.error_message });
    }

    const suggestions = data.predictions.map((p: any) => ({
      place_id: p.place_id,
      description: p.description,
      matched_substrings: p.matched_substrings,
    }));

    res.json({
      suggestions,
      provider: "google",
    });
  } catch (error: any) {
    console.error("Autocomplete Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}
