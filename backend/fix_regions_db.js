const { Client } = require('pg');
const crypto = require('crypto');

async function fix() {
  const client = new Client({
    connectionString: "postgresql://neondb_owner:npg_0YmB1whTfKVS@ep-square-smoke-ab2qlk9c-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&uselibpqcompat=true"
  });
  
  try {
    await client.connect();
    
    // Get the region_id
    const resRegion = await client.query(`SELECT id, name FROM region LIMIT 1`);
    if(resRegion.rows.length === 0) return;
    
    const regionId = resRegion.rows[0].id;
    console.log("Using Region ID:", regionId);

    // Make sure the provider is in the DB
    const rppId = 'rpp_' + crypto.randomBytes(8).toString('hex');
    await client.query(`
      INSERT INTO region_payment_provider (id, region_id, payment_provider_id)
      VALUES ($1, $2, $3)
      ON CONFLICT DO NOTHING
    `, [rppId, regionId, 'pp_mollie-hosted-checkout_mollie']);
    
    console.log("Successfully linked Mollie Hosted Checkout to region.");
    
  } catch(e) {
    console.error("DB Error:", e);
  } finally {
    await client.end();
  }
}

fix();
