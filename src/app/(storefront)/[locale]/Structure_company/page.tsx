import React from 'react';
import styles from './page.module.css';

export const metadata = {
  title: 'Company Structure',
  description: 'Global corporate structure for the Kindard brand.',
};

const companies = [
  {
    id: '01',
    name: 'Kindard Group AG',
    type: 'Parent Holding Company',
    location: 'Zurich, Switzerland',
    purpose: 'Holding company, brand ownership, and global strategy.',
  },
  {
    id: '02',
    name: 'Kindard Fashion Europe GmbH',
    type: 'European Fashion Operations',
    location: 'Switzerland / Germany',
    purpose: 'Sales, regional warehousing, and European customer support.',
  },
  {
    id: '03',
    name: 'Kindard Commerce Ltd',
    type: 'Digital & Technology Division',
    location: 'United Kingdom',
    purpose: 'Global e-commerce platforms, mobile applications, and AI backend systems.',
  },
  {
    id: '04',
    name: 'Kindard Logistics BV',
    type: 'Logistics & Distribution',
    location: 'Netherlands',
    purpose: 'Centralized EU logistics, warehousing, and returns processing.',
  },
  {
    id: '05',
    name: 'Kindard IP Holding AG',
    type: 'Intellectual Property',
    location: 'Zurich, Switzerland',
    purpose: 'Trademark ownership, software rights, and global licensing.',
  },
];

export default function CompanyStructurePage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Corporate Structure</h1>
        <p className={styles.subtitle}>
          An overview of the international operating entities powering the Kindard brand worldwide. Headquartered in Zurich, Switzerland.
        </p>
      </header>

      <div className={styles.grid}>
        {companies.map((company) => (
          <div key={company.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <span>{company.id}</span>
              {company.type}
            </div>
            
            <div className={styles.cardBody}>
              <div className={styles.property}>
                <span className={styles.propertyLabel}>Entity Name</span>
                <span className={styles.propertyValue}>{company.name}</span>
              </div>

              <div className={styles.property}>
                <span className={styles.propertyLabel}>Headquarters</span>
                <span className={styles.propertyValue}>{company.location}</span>
              </div>

              <div className={styles.property}>
                <span className={styles.propertyLabel}>Primary Functions</span>
                <span className={styles.propertyValue}>{company.purpose}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.bottomSection}>
        <div className={styles.infoBox}>
          <h3>Brand Positioning</h3>
          <p style={{ marginBottom: '16px', lineHeight: 1.6 }}>
            Kindard is globally positioned as a leader in premium youth streetwear and modern digital commerce.
          </p>
          <div className={styles.tagList}>
            <span className={styles.tag}>Premium Kids Streetwear</span>
            <span className={styles.tag}>Zurich Designed</span>
            <span className={styles.tag}>Fashion-Tech Innovator</span>
          </div>
        </div>

        <div className={styles.infoBox}>
          <h3>Global Digital Footprint</h3>
          <p style={{ marginBottom: '16px', lineHeight: 1.6 }}>
            Our digital infrastructure is distributed across core domains to ensure high performance worldwide:
          </p>
          <ul className={styles.list}>
            <li><strong>kindard.com</strong> — Global storefront</li>
            <li><strong>app.kindard.com</strong> — Mobile progressive app</li>
            <li><strong>api.kindard.com</strong> — Headless commerce layer</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
