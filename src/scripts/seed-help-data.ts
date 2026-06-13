import { getPayload } from 'payload';
import configPromise from '../payload.config';
import * as dotenv from 'dotenv';

dotenv.config();

process.env.SMTP_HOST = 'localhost';
process.env.SMTP_PORT = '2525';
process.env.SMTP_USER = '';
process.env.SMTP_PASS = '';
if (!process.env.PAYLOAD_SECRET) process.env.PAYLOAD_SECRET = 'mysecret';

async function run() {
  const payload = await getPayload({ config: configPromise });

  console.log('Seeding Help Center Page Global...');
  await payload.updateGlobal({
    slug: 'help-center-page',
    data: {
      title: 'Welcome! How can we help?',
      subtitle: 'Search our help center for quick answers about Kindard Kids',
      searchPlaceholder: 'Search for sizing, shipping, returns...',
      categories: [
        {
          icon: 'help-circle',
          title: 'Frequently Asked Questions',
          description: 'Find answers to common questions about shopping with Kindard Kids, sizing, and our materials.'
        },
        {
          icon: 'settings',
          title: 'Features and Durability',
          description: 'Learn about our premium fabric technology, durability features, and care instructions.'
        },
        {
          icon: 'users',
          title: 'Users and Accounts',
          description: 'Manage your Kindard Kids account, order history, and saved items.'
        },
        {
          icon: 'wallet',
          title: 'Billing and Payments',
          description: 'Information about accepted payment methods, secure checkout, and billing inquiries.'
        }
      ]
    }
  });

  console.log('Seeding Help Articles...');
  
  const articles = [
    {
      title: 'What is your return policy?',
      content: [
        {
          children: [{ text: 'We offer a 30-day satisfaction guarantee. If your little one isn\'t happy with the fit, you can return unworn, unwashed items with tags attached for a full refund or exchange. Returns are completely free. Just head over to our ' }, { text: 'Returns Portal', type: 'link', url: '/returns-exchanges' }, { text: ' to get started.' }]
        }
      ]
    },
    {
      title: 'How do your sizes run?',
      content: [
        {
          children: [{ text: 'Our kids streetwear features a signature oversized, baggy fit. We strongly recommend ordering their true age size (e.g. 4T for a 4-year-old) for the intended drop-shoulder, relaxed look. Sizing up is usually unnecessary unless they are exceptionally tall for their age.' }]
        }
      ]
    },
    {
      title: 'How long does shipping take?',
      content: [
        {
          children: [{ text: 'All orders over $150 qualify for free express shipping. Domestic orders typically arrive within 2-4 business days. International orders can take between 7-14 days depending on the destination. You can always check the status of your order on our ' }, { text: 'Order Tracking', type: 'link', url: '/track-order' }, { text: ' page.' }]
        }
      ]
    },
    {
      title: 'Are your materials sustainably sourced?',
      content: [
        {
          children: [{ text: 'Yes. Kindard Kids is committed to the future. Our heavy-weight cotton is 100% organic and ethically manufactured. We also use carbon-neutral shipping for all deliveries to reduce our environmental impact as much as possible.' }]
        }
      ]
    },
    {
      title: 'Frequently Asked Questions',
      content: [
        {
          children: [{ text: 'Welcome to our FAQ section. Here you can find answers to all your common questions regarding Kindard. Our team works hard to keep this section updated.' }]
        }
      ]
    },
    {
      title: 'Features and Durability',
      content: [
        {
          children: [{ text: 'Our clothes are designed to last. From reinforced stitching on the knees of our jeans to premium heavyweight cotton on our hoodies, Kindard Kids apparel is built for playground durability.' }]
        }
      ]
    },
    {
      title: 'Users and Accounts',
      content: [
        {
          children: [{ text: 'Creating an account allows you to track your orders, save your wishlist, and manage your returns. You can update your profile details and preferences in your account settings.' }]
        }
      ]
    },
    {
      title: 'Billing and Payments',
      content: [
        {
          children: [{ text: 'We accept all major credit cards, Apple Pay, Google Pay, and PayPal. All transactions are securely processed and encrypted. If you have a billing issue, please contact support.' }]
        }
      ]
    }
  ];

  for (const article of articles) {
    // Check if article exists
    const existing = await payload.find({
      collection: 'help-articles',
      where: {
        title: {
          equals: article.title
        }
      }
    });

    if (existing.totalDocs === 0) {
      await payload.create({
        collection: 'help-articles',
        data: {
          title: article.title,
          content: {
            root: {
              type: 'root',
              format: '',
              indent: 0,
              version: 1,
              direction: 'ltr',
              children: [
                {
                  type: 'paragraph',
                  format: '',
                  indent: 0,
                  version: 1,
                  direction: 'ltr',
                  children: article.content[0].children.map((child: any) => ({
                    detail: 0,
                    format: 0,
                    mode: 'normal',
                    style: '',
                    text: child.text || '',
                    type: child.type || 'text',
                    version: 1,
                    ...(child.url ? {
                      type: 'link',
                      fields: {
                        url: child.url,
                        newTab: false,
                        linkType: 'custom'
                      },
                      children: [{
                        detail: 0,
                        format: 0,
                        mode: 'normal',
                        style: '',
                        text: child.text,
                        type: 'text',
                        version: 1
                      }]
                    } : {})
                  }))
                }
              ]
            }
          },
          _status: 'published' // Ensure it is published
        } as any
      });
      console.log(`Created article: ${article.title}`);
    } else {
      console.log(`Article already exists: ${article.title}`);
    }
  }

  console.log('Seeding complete!');
  process.exit(0);
}

run().catch(console.error);
