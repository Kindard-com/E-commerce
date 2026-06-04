const axios = require('axios');

async function run() {
  try {
    const res = await axios.get("http://127.0.0.1:9000/admin/regions", {
      headers: {
        "Authorization": "Bearer sk_1c9eccccec38de3046749b29f09292146f1587ded88e1b8a359782f0f58398b2"
      }
    });
    console.log("Regions:", res.data.regions.map(r => r.name));
  } catch(e) {
    console.error("Error:", e.message);
  }
}

run();
