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

// a tarot card for the home page skills section, which one gets drawn is random and only for flavor
export type Arcana = {
  image: ImageLoader; // front of the card, the name and number are printed on the art
  name: string;
  numeral: string;
  description: string;
  major: boolean; // major arcana true, minor false
};
