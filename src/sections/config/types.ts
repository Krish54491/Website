// shared types for the section configs
export type ImageLoader = () => Promise<{ default: string }>;

export type Card = {
  id: string;
  name: string;
  description: string;
  path: string;
  lightThumbnail?: ImageLoader; // only making optional for testing
  darkThumbnail?: ImageLoader; // only making optional for testing
  mobile?: boolean; // default to true
};
