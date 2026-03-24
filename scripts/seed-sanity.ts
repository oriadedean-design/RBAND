import 'dotenv/config';
import { createClient } from '@sanity/client';
import { ABOUT_INFO, CREATORS, GALLERY_IMAGES, GRANT_INFO, JOURNAL_POSTS } from './seedData';

type SanityDocument = Record<string, unknown> & { _id: string; _type: string };

const projectId = process.env.VITE_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID;
const dataset = process.env.VITE_SANITY_DATASET || process.env.SANITY_DATASET || 'production';
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !token) {
  console.error('Missing required env vars. Set SANITY_PROJECT_ID (or VITE_SANITY_PROJECT_ID) and SANITY_API_TOKEN.');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2025-01-01',
  token,
  useCdn: false,
});

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

const normalizeDate = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return new Date().toISOString();
  }
  return parsed.toISOString();
};

async function createIfMissing(document: SanityDocument) {
  await client.createIfNotExists(document);
  return document._id;
}

async function createSingletonIfTypeEmpty(document: SanityDocument) {
  const count = await client.fetch<number>('count(*[_type == $type])', { type: document._type });
  if (count > 0) {
    console.log(`Skipping ${document._type}: existing document already present.`);
    return;
  }

  await client.createIfNotExists(document);
  console.log(`Seeded singleton ${document._type}.`);
}

async function seedAuthors() {
  for (const post of JOURNAL_POSTS) {
    const authorId = `legacy-author-${slugify(post.author)}`;
    await createIfMissing({
      _id: authorId,
      _type: 'author',
      name: post.author,
      source: 'legacy-seed',
    });
  }
}

async function seedCreators() {
  for (const creator of CREATORS) {
    await createIfMissing({
      _id: `legacy-creator-${slugify(creator.id || creator.name)}`,
      _type: 'creator',
      name: creator.name,
      role: creator.role,
      location: creator.location,
      highlight: creator.highlight,
      stats: creator.stats,
      quote: creator.quote,
      source: 'legacy-seed',
      legacyImageUrl: creator.image,
    });
  }
}

async function seedJournalPosts() {
  for (const post of JOURNAL_POSTS) {
    const slug = slugify(post.id || post.title);
    const authorId = `legacy-author-${slugify(post.author)}`;

    await createIfMissing({
      _id: `legacy-journal-${slug}`,
      _type: 'journalPost',
      title: post.title,
      date: normalizeDate(post.date),
      category: post.category,
      excerpt: post.excerpt,
      slug: { _type: 'slug', current: slug },
      source: 'legacy-seed',
      legacyImageUrl: post.image,
      author: { _type: 'reference', _ref: authorId },
      content: [
        {
          _type: 'block',
          style: 'normal',
          markDefs: [],
          children: [{ _type: 'span', text: post.excerpt, marks: [] }],
        },
      ],
    });
  }
}

async function seedGallery() {
  for (const image of GALLERY_IMAGES) {
    const id = `legacy-gallery-${slugify(`${image.title}-${image.creator}`)}`;
    await createIfMissing({
      _id: id,
      _type: 'galleryImage',
      title: image.title,
      creator: image.creator,
      source: 'legacy-seed',
      legacyImageUrl: image.url,
    });
  }
}

async function seedAboutAndGrant() {
  await createSingletonIfTypeEmpty({
    _id: 'legacy-about-info',
    _type: 'aboutInfo',
    source: 'legacy-seed',
    ...ABOUT_INFO,
  });

  await createSingletonIfTypeEmpty({
    _id: 'legacy-grant-info',
    _type: 'grantInfo',
    source: 'legacy-seed',
    ...GRANT_INFO,
  });
}

async function run() {
  console.log('Starting non-destructive legacy content seed...');
  await seedAuthors();
  await seedCreators();
  await seedJournalPosts();
  await seedGallery();
  await seedAboutAndGrant();
  console.log('Done. Existing documents were not overwritten.');
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
