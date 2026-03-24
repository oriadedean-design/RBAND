import { sanityClient } from '../lib/sanity';
import { CREATORS, JOURNAL_POSTS, GALLERY_IMAGES } from '../constants';

export interface Creator {
  id: string;
  name: string;
  role: string;
  location: string;
  highlight: string;
  image: string;
  stats: string;
  quote: string;
}

export interface JournalPost {
  id: string;
  title: string;
  date: string;
  author: string;
  category: string;
  image: string;
  excerpt: string;
  content?: any; // Sanity Portable Text
}

export interface GalleryImage {
  url: string;
  title: string;
  creator: string;
}

export interface GrantInfo {
  title: string;
  description: string;
  fundingAmount: string;
  mentorshipDetails: string;
  exposureDetails: string;
  status: string;
}

export interface AboutInfo {
  title: string;
  description: string;
  mission: string;
  vision: string;
  email: string;
  location: string;
  instagram: string;
}

const isSanityConfigured = !!import.meta.env.VITE_SANITY_PROJECT_ID;

export const sanityService = {
  async getCreators(): Promise<Creator[]> {
    if (!isSanityConfigured) return CREATORS;
    
    const query = `*[_type == "creator"] {
      "id": _id,
      name,
      role,
      location,
      highlight,
      "image": image.asset->url,
      stats,
      quote
    }`;
    return sanityClient.fetch(query);
  },

  async getJournalPosts(): Promise<JournalPost[]> {
    if (!isSanityConfigured) return JOURNAL_POSTS;

    const query = `*[_type == "journalPost"] | order(date desc) {
      "id": _id,
      title,
      date,
      "author": author->name,
      category,
      "image": image.asset->url,
      excerpt,
      content
    }`;
    return sanityClient.fetch(query);
  },

  async getJournalPost(id: string): Promise<JournalPost | null> {
    if (!isSanityConfigured) return JOURNAL_POSTS.find(p => p.id === id) || null;

    const query = `*[_type == "journalPost" && _id == $id][0] {
      "id": _id,
      title,
      date,
      "author": author->name,
      category,
      "image": image.asset->url,
      excerpt,
      content
    }`;
    return sanityClient.fetch(query, { id });
  },

  async getGalleryImages(): Promise<GalleryImage[]> {
    if (!isSanityConfigured) return GALLERY_IMAGES;

    const query = `*[_type == "galleryImage"] {
      "url": image.asset->url,
      title,
      creator
    }`;
    return sanityClient.fetch(query);
  },

  async getGrantInfo(): Promise<GrantInfo | null> {
    if (!isSanityConfigured) return {
      title: "FUNDING YOUR VISION",
      description: "We believe in the power of creative growth. The ROSSE Creative Grant is designed to provide the resources, funding, and mentorship needed to take your project from a nebula to a star.",
      fundingAmount: "No strings attached grants to cover equipment, studio time, or production costs for your next big project.",
      mentorshipDetails: "Connect with industry legends and established creators who will guide your artistic and professional development.",
      exposureDetails: "Your work will be featured across the ROSSE network, reaching millions of viewers and potential collaborators.",
      status: "APPLICATIONS OPENING SOON."
    };

    const query = `*[_type == "grantInfo"][0] {
      title,
      description,
      fundingAmount,
      mentorshipDetails,
      exposureDetails,
      status
    }`;
    return sanityClient.fetch(query);
  },

  async getAboutInfo(): Promise<AboutInfo | null> {
    if (!isSanityConfigured) return {
      title: "WE ARE THE NEBULA FOR CREATIVES.",
      description: "ROSSE HUB is more than a platform; it’s a global movement. We connect creative communities worldwide, helping visionaries find their nebula and get noticed. Our mission is to bridge the gap between talent and opportunity.",
      mission: "To empower the next generation of creative leaders by providing a platform for storytelling, collaboration, and growth. We believe that every creator deserves to be seen and heard.",
      vision: "A world where creative boundaries are non-existent, and collaboration is the primary driver of artistic innovation. We are building the infrastructure for the future of the creative economy.",
      email: "HELLO@ROSSEHUB.COM",
      location: "TORONTO, CANADA — GLOBAL",
      instagram: "@ROSSEHUB"
    };

    const query = `*[_type == "aboutInfo"][0] {
      title,
      description,
      mission,
      vision,
      email,
      location,
      instagram
    }`;
    return sanityClient.fetch(query);
  }
};
