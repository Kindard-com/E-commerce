import { getPayload } from 'payload';
import configPromise from './src/payload.config';

async function seed() {
  const payload = await getPayload({ config: configPromise });
  
  const existing = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'help-contact' } }
  });

  if (existing.docs.length > 0) {
    console.log('Page already exists:', existing.docs[0].id);
    return;
  }

  const newPage = await payload.create({
    collection: 'pages',
    data: {
      title: 'Help & Contact',
      slug: 'help-contact',
      _status: 'published',
      layout: [
        {
          blockType: 'ticketForm',
          heading: 'Submit a Support Ticket',
          description: 'Need help? Fill out the form below and we will get back to you.',
          successMessage: 'Your ticket has been successfully submitted.'
        }
      ]
    }
  });

  console.log('Page created successfully!', newPage.id);
  process.exit(0);
}

seed().catch(console.error);
