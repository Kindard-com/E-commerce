import { neon } from "@neondatabase/serverless";
const sql = neon("postgresql://neondb_owner:npg_0YmB1whTfKVS@ep-square-smoke-ab2qlk9c-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require");

async function run() {
  try {
    console.log("Creating users...");
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        customer_number VARCHAR(255) PRIMARY KEY,
        firebase_uid VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        login_provider VARCHAR(100),
        provider_user_id VARCHAR(255),
        profile_image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    console.log("Creating customer_profiles...");
    await sql`
      CREATE TABLE IF NOT EXISTS customer_profiles (
        customer_number VARCHAR(255) PRIMARY KEY REFERENCES users(customer_number) ON DELETE CASCADE,
        full_name VARCHAR(255),
        phone VARCHAR(100),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    console.log("Creating account_settings...");
    await sql`
      CREATE TABLE IF NOT EXISTS account_settings (
        customer_number VARCHAR(255) PRIMARY KEY REFERENCES users(customer_number) ON DELETE CASCADE,
        language VARCHAR(50) DEFAULT 'en',
        email_notifications INTEGER DEFAULT 1,
        marketing_consent INTEGER DEFAULT 0,
        security_settings TEXT,
        status VARCHAR(50) DEFAULT 'active'
      );
    `;

    console.log("Creating activity_logs...");
    await sql`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id VARCHAR(255) PRIMARY KEY,
        customer_number VARCHAR(255) NOT NULL REFERENCES users(customer_number) ON DELETE CASCADE,
        last_online TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        login_method VARCHAR(100)
      );
    `;

    console.log("Creating reports...");
    await sql`
      CREATE TABLE IF NOT EXISTS reports (
        id VARCHAR(255) PRIMARY KEY,
        report_number VARCHAR(255) UNIQUE NOT NULL,
        customer_number VARCHAR(255) NOT NULL REFERENCES users(customer_number) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        message TEXT,
        status VARCHAR(50) DEFAULT 'open',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    console.log("Creating customer_service_tickets...");
    await sql`
      CREATE TABLE IF NOT EXISTS customer_service_tickets (
        id VARCHAR(255) PRIMARY KEY,
        ticket_number VARCHAR(255) UNIQUE NOT NULL,
        customer_number VARCHAR(255) NOT NULL REFERENCES users(customer_number) ON DELETE CASCADE,
        subject VARCHAR(255) NOT NULL,
        message TEXT,
        status VARCHAR(50) DEFAULT 'open',
        priority VARCHAR(50) DEFAULT 'normal',
        staff_assigned VARCHAR(255),
        internal_notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_response_date TIMESTAMP
      );
    `;

    console.log("Creating search_logs...");
    await sql`
      CREATE TABLE IF NOT EXISTS search_logs (
        id VARCHAR(255) PRIMARY KEY,
        customer_number VARCHAR(255),
        firebase_uid VARCHAR(255),
        session_id VARCHAR(255) NOT NULL,
        search_query TEXT,
        search_filters TEXT,
        clicked_product_id VARCHAR(255),
        result_count INTEGER,
        search_type VARCHAR(100),
        is_logged_in INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    console.log("Creating customer_search_preferences...");
    await sql`
      CREATE TABLE IF NOT EXISTS customer_search_preferences (
        id VARCHAR(255) PRIMARY KEY,
        customer_number VARCHAR(255) UNIQUE NOT NULL REFERENCES users(customer_number) ON DELETE CASCADE,
        firebase_uid VARCHAR(255) UNIQUE NOT NULL,
        preferred_categories TEXT,
        preferred_brands TEXT,
        preferred_sizes TEXT,
        preferred_colors TEXT,
        average_price_range VARCHAR(255),
        last_search_query TEXT,
        last_clicked_product_id VARCHAR(255),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    console.log("Creating admin_roles...");
    await sql`
      CREATE TABLE IF NOT EXISTS admin_roles (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        description TEXT
      );
    `;

    console.log("Creating admin_permissions...");
    await sql`
      CREATE TABLE IF NOT EXISTS admin_permissions (
        id VARCHAR(255) PRIMARY KEY,
        role_id VARCHAR(255) NOT NULL REFERENCES admin_roles(id) ON DELETE CASCADE,
        permission VARCHAR(255) NOT NULL
      );
    `;

    console.log("Creating admin_users...");
    await sql`
      CREATE TABLE IF NOT EXISTS admin_users (
        id VARCHAR(255) PRIMARY KEY,
        admin_number VARCHAR(255) UNIQUE NOT NULL,
        firebase_uid VARCHAR(255),
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(100) NOT NULL,
        status VARCHAR(50) DEFAULT 'active',
        profile_image_url TEXT,
        last_login_at TIMESTAMP,
        last_online_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    console.log("Creating site_settings...");
    await sql`
      CREATE TABLE IF NOT EXISTS site_settings (
        id VARCHAR(255) PRIMARY KEY,
        setting_key VARCHAR(255) UNIQUE NOT NULL,
        setting_value TEXT,
        setting_type VARCHAR(100),
        category VARCHAR(100),
        updated_by_admin_number VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    console.log("Creating legal_pages...");
    await sql`
      CREATE TABLE IF NOT EXISTS legal_pages (
        id VARCHAR(255) PRIMARY KEY,
        page_type VARCHAR(100) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        content TEXT,
        version INTEGER DEFAULT 1,
        status VARCHAR(50) DEFAULT 'published',
        updated_by_admin_number VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    console.log("Creating settings_audit_logs...");
    await sql`
      CREATE TABLE IF NOT EXISTS settings_audit_logs (
        id VARCHAR(255) PRIMARY KEY,
        admin_number VARCHAR(255) NOT NULL,
        action VARCHAR(255) NOT NULL,
        setting_key VARCHAR(255),
        old_value TEXT,
        new_value TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    console.log("All tables created successfully.");
  } catch (e) {
    console.error(e);
  }
}

run();
