export const COOLDOWN_MS: number = 60000; // 60 seconds in milliseconds
export const COMMENT_COOLDOWN_MS: number = 2000; // 2 seconds in milliseconds
export const MAX_DUPLICATE_COMMENTS: number = 10;
export const NO_COMMENTS_PAGES = [
  // only the core pages shouldn't have comments I'll have to implement this in the backend as well
  "home",
  "login",
  "account",
  "register",
  "games",
  "tools",
  "projects",
];
