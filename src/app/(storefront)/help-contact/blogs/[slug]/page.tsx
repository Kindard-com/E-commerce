import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { RichText } from '@/components/RichText'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'help-articles',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  })

  const article = docs[0]
  if (!article) return { title: 'Help Article' }

  return {
    title: `${article.title} | Help Center`,
  }
}

export default async function HelpArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  const { docs } = await payload.find({
    collection: 'help-articles',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  })

  const article = docs[0]

  if (!article) {
    notFound()
  }

  return (
    <>
      <style>{`
        .blog-container {
          background: #fafafa;
          min-height: 100vh;
          padding-bottom: 80px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        .blog-hero {
          background: #3252df;
          color: white;
          padding: 60px 24px 80px;
          position: relative;
          overflow: hidden;
        }
        .blog-hero-bg {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg width='800' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 300 L50 300 L50 250 L100 250 L100 150 L150 150 L150 280 L200 280 L200 180 L250 180 L250 220 L300 220 L300 100 L350 100 L350 260 L400 260 L400 130 L450 130 L450 200 L500 200 L500 80 L550 80 L550 240 L600 240 L600 170 L650 170 L650 290 L700 290 L700 210 L750 210 L750 300 L800 300' fill='none' stroke='%234b68e5' stroke-width='1.5' /%3E%3C/svg%3E");
          background-size: cover;
          background-position: center;
          opacity: 0.3;
        }
        .blog-hero-content {
          max-width: 800px;
          margin: 0 auto;
          position: relative;
          z-index: 10;
        }
        .blog-back-link {
          display: inline-flex;
          align-items: center;
          color: #dbeafe;
          text-decoration: none;
          font-weight: 500;
          margin-bottom: 24px;
          transition: color 0.2s;
        }
        .blog-back-link:hover {
          color: #ffffff;
        }
        .blog-title {
          font-size: 44px;
          font-weight: 800;
          line-height: 1.1;
          margin: 0;
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .blog-content-wrapper {
          max-width: 800px;
          margin: -40px auto 0;
          padding: 0 24px;
          position: relative;
          z-index: 20;
        }
        .blog-content-card {
          background: white;
          border-radius: 16px;
          padding: 48px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
          border: 1px solid #f1f5f9;
        }
        .blog-richtext {
          font-size: 17px;
          line-height: 1.6;
          color: #334155;
        }
        .blog-richtext h1, .blog-richtext h2, .blog-richtext h3 {
          color: #0f172a;
          margin-top: 32px;
          margin-bottom: 16px;
          font-weight: 700;
        }
        .blog-richtext h2 { font-size: 28px; }
        .blog-richtext h3 { font-size: 22px; }
        .blog-richtext p {
          margin-bottom: 20px;
        }
        .blog-richtext a {
          color: #3252df;
          text-decoration: underline;
          font-weight: 500;
        }
        .blog-richtext a:hover {
          color: #1e3a8a;
        }
        .blog-richtext ul {
          padding-left: 24px;
          margin-bottom: 20px;
          list-style-type: disc;
        }
        .blog-richtext ol {
          padding-left: 24px;
          margin-bottom: 20px;
          list-style-type: decimal;
        }
        .blog-richtext li {
          margin-bottom: 8px;
        }
        @media (max-width: 600px) {
          .blog-content-card { padding: 32px 20px; }
          .blog-title { font-size: 32px; }
        }
      `}</style>
      <div className="blog-container">
        <div className="blog-hero">
          <div className="blog-hero-bg"></div>
          <div className="blog-hero-content">
            <Link href="/help-contact" className="blog-back-link">
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back to Help Center
            </Link>
            <h1 className="blog-title">{article.title}</h1>
          </div>
        </div>
        
        <div className="blog-content-wrapper">
          <div className="blog-content-card">
            {article.content && (
              <div className="blog-richtext">
                <RichText 
                  data={article.content} 
                  enableGutter={false} 
                  enableProse={false}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
