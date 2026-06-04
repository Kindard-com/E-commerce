import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const postcode = req.query.postcode as string;
  const house_number = req.query.house_number as string;
  const country = req.query.country as string || "NL";

  if (!postcode || !house_number) {
    return res.status(400).json({ message: "Missing postcode or house_number parameter" });
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    // Mock response
    return res.json({
      valid: true,
      address: {
        address_1: `Mockstraat ${house_number}`,
        city: "Amsterdam",
        province: "Noord-Holland",
        postal_code: postcode,
        country_code: country,
      },
      metadata: {
        address_verified: true,
        address_provider: "mock",
      }
    });
  }

  try {
    const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");
    url.searchParams.append("address", `${house_number} ${postcode}`);
    url.searchParams.append("components", `country:${country}`);
    url.searchParams.append("key", apiKey);

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.status !== "OK" || data.results.length === 0) {
      return res.status(404).json({ valid: false, message: "Address not found" });
    }

    const components = data.results[0].address_components || [];
    
    let route = "";
    let street_number = "";
    let locality = "";
    let admin_area = "";
    let pc = "";
    let cc = "";

    for (const comp of components) {
      if (comp.types.includes("route")) route = comp.long_name;
      if (comp.types.includes("street_number")) street_number = comp.long_name;
      if (comp.types.includes("locality") || comp.types.includes("postal_town")) locality = comp.long_name;
      if (comp.types.includes("administrative_area_level_1")) admin_area = comp.short_name;
      if (comp.types.includes("postal_code")) pc = comp.long_name;
      if (comp.types.includes("country")) cc = comp.short_name.toLowerCase();
    }

    return res.json({
      valid: true,
      address: {
        address_1: street_number ? `${route} ${street_number}` : route,
        address_2: "",
        city: locality,
        province: admin_area,
        postal_code: pc || postcode,
        country_code: cc || country,
      },
      metadata: {
        address_verified: true,
        address_provider: "google_geocode",
        latitude: data.results[0].geometry?.location?.lat?.toString(),
        longitude: data.results[0].geometry?.location?.lng?.toString(),
      }
    });
  } catch (error: any) {
    console.error("Geocode Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}
