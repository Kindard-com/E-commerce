import { Metadata } from 'next';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { HelpCircle, Settings, Users, Wallet, Search } from 'lucide-react';
import React from 'react';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Help Center | Kindard Kids',
    description: 'Search in our help center for quick answers'
  };
}

const IconMap: Record<string, React.ElementType> = {
  'help-circle': HelpCircle,
  'settings': Settings,
  'users': Users,
  'wallet': Wallet,
};

export default async function HelpCenterPage() {
  const payload = await getPayload({ config: configPromise });
  let helpData: any = {};
  
  try {
    helpData = await payload.findGlobal({ slug: 'help-center-page' }) as any;
  } catch (error) {
    console.error("Payload HelpCenterPage not initialized yet.");
  }

  // Fallbacks if not set in Payload
  const title = helpData?.title || "Welcome! How can we help?";
  const subtitle = helpData?.subtitle || "Search in our help center for quick answers";
  const searchPlaceholder = helpData?.searchPlaceholder || "Search for questions or topics...";
  
  const categories = helpData?.categories && helpData.categories.length > 0 
    ? helpData.categories 
    : [
      {
        id: '1',
        icon: 'help-circle',
        title: 'Frequently Asked Questions',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ac pellentesque diam felis. In at elementum nulla.'
      },
      {
        id: '2',
        icon: 'settings',
        title: 'Features and Functionalities',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ac pellentesque diam felis. In at elementum nulla.'
      },
      {
        id: '3',
        icon: 'users',
        title: 'Users and Collaboration',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ac pellentesque diam felis. In at elementum nulla.'
      },
      {
        id: '4',
        icon: 'wallet',
        title: 'Billing and Payments',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ac pellentesque diam felis. In at elementum nulla.'
      }
    ];

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Hero Section */}
      <div style={{ 
        backgroundColor: '#3b5af2', // Blue background
        padding: '80px 20px 140px',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center'
      }}>
        {/* City Skyline Background Pattern SVG */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '150px',
          opacity: 0.15,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 1000 150' preserveAspectRatio='none'%3E%3Cpath fill='%23ffffff' d='M0,150 L0,80 L20,80 L20,40 L40,40 L40,90 L60,90 L60,30 L80,30 L80,100 L110,100 L110,20 L140,20 L140,70 L170,70 L170,10 L190,10 L190,110 L230,110 L230,50 L260,50 L260,80 L300,80 L300,30 L340,30 L340,100 L380,100 L380,40 L420,40 L420,90 L460,90 L460,20 L500,20 L500,70 L540,70 L540,50 L580,50 L580,110 L620,110 L620,30 L660,30 L660,80 L700,80 L700,10 L740,10 L740,90 L780,90 L780,40 L820,40 L820,100 L860,100 L860,20 L900,20 L900,60 L940,60 L940,30 L980,30 L980,80 L1000,80 L1000,150 Z'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat-x',
          backgroundPosition: 'bottom',
          pointerEvents: 'none'
        }}></div>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ 
            color: '#ffffff', 
            fontSize: '42px', 
            fontWeight: 700, 
            marginBottom: '16px',
            fontFamily: "'Barlow Condensed', sans-serif",
            letterSpacing: '0.5px'
          }}>
            {title}
          </h1>
          <p style={{ 
            color: 'rgba(255,255,255,0.9)', 
            fontSize: '18px', 
            marginBottom: '40px' 
          }}>
            {subtitle}
          </p>

          {/* Search Bar */}
          <form 
            action="/help-contact/search"
            style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#ffffff',
            borderRadius: '50px',
            padding: '8px 8px 8px 24px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
            maxWidth: '650px',
            margin: '0 auto',
            position: 'relative'
          }}>
            <Search color="#9ba3af" size={20} />
            <input 
              type="text" 
              name="q"
              placeholder={searchPlaceholder}
              style={{
                border: 'none',
                outline: 'none',
                flex: 1,
                padding: '12px 16px',
                fontSize: '16px',
                color: '#333'
              }}
            />
            <button type="submit" style={{
              backgroundColor: '#3b5af2',
              color: '#ffffff',
              border: 'none',
              borderRadius: '40px',
              padding: '12px 32px',
              fontWeight: 600,
              fontSize: '15px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(59, 90, 242, 0.3)'
            }}>
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Cards Section */}
      <div style={{ 
        maxWidth: '800px', 
        margin: '-60px auto 100px auto', // Pull up to overlap hero
        padding: '0 20px',
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        {categories.map((category: any, index: number) => {
          const IconComponent = IconMap[category.icon] || HelpCircle;
          return (
            <a href={`/help-contact/blogs/${category.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} key={category.id || index} style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '32px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '24px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
              border: '1px solid rgba(0,0,0,0.02)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'pointer',
              textDecoration: 'none'
            }}
            className="help-card"
            >
              <div style={{
                backgroundColor: '#f0f4ff', // Light blue background for icon circle
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <IconComponent color="#3b5af2" size={32} />
              </div>
              <div>
                <h3 style={{ 
                  color: '#3b5af2', 
                  fontSize: '20px', 
                  fontWeight: 700, 
                  marginBottom: '8px',
                  marginTop: '4px'
                }}>
                  {category.title}
                </h3>
                <p style={{ 
                  color: '#6b7280', 
                  fontSize: '15px', 
                  lineHeight: 1.6,
                  margin: 0 
                }}>
                  {category.description}
                </p>
              </div>
            </a>
          );
        })}
      </div>

      {/* Hover effect styles */}
      <style dangerouslySetInnerHTML={{__html: `
        .help-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(0,0,0,0.06) !important;
        }
      `}} />
    </div>
  );
}
