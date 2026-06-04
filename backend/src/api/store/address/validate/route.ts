import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { place_id, address_line_1, city, postal_code, country } = req.body as any;

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    // Mock response if no API key is provided
    return res.json({
      valid: true,
      address: {
        address_1: address_line_1 || "Mock Street 10",
        address_2: "",
        city: city || "Mock City",
        province: "Mock Province",
        postal_code: postal_code || "12345",
        country_code: country || "US",
      },
      metadata: {
        address_verified: true,
        address_provider: "mock",
        address_validation_score: "high",
        latitude: "52.3702",
        longitude: "4.8952",
      }
    });
  }

  try {
    if (place_id) {
      // Use Place Details API to get structured address components from a place_id
      const url = new URL("https://maps.googleapis.com/maps/api/place/details/json");
      url.searchParams.append("place_id", place_id);
      url.searchParams.append("fields", "address_components,geometry");
      url.searchParams.append("key", apiKey);

      const response = await fetch(url.toString());
      const data = await response.json();

      if (data.status !== "OK") {
        return res.status(400).json({ valid: false, message: "Invalid place ID or provider error" });
      }

      const components = data.result.address_components || [];
      
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
          postal_code: pc,
          country_code: cc || country,
        },
        metadata: {
          address_verified: true,
          address_provider: "google",
          address_validation_score: "high",
          provider_reference: place_id,
          latitude: data.result.geometry?.location?.lat?.toString(),
          longitude: data.result.geometry?.location?.lng?.toString(),
        }
      });
    }

    // Fallback: If no place_id, they entered manually. We could use Address Validation API here.
    // For now, return verified: false
    return res.json({
      valid: true,
      address: {
        address_1: address_line_1,
        city,
        postal_code,
        country_code: country,
      },
      metadata: {
        address_verified: false,
        address_provider: "manual",
      }
    });

  } catch (error: any) {
    console.error("Validation Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}
