const axios = require('axios');

async function run() {
  try {
    const res = await axios.get("http://127.0.0.1:9000/admin/regions", {
      headers: {
        "Authorization": `Bearer ${process.env.MEDUSA_ADMIN_API_KEY || ""}`
      }
    });
    console.log("Regions:", res.data.regions.map(r => r.name));
  } catch(e) {
    console.error("Error:", e.message);
  }
}

run();
