import { boolean } from "drizzle-orm/gel-core";
import { pgTable, timestamp, text, uuid, integer } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  created_at: timestamp("created_at").defaultNow(),
  username: text("username").notNull().default("Anon"),
  device_id: text("device_id").unique(),
  email: text("email").unique(),
  password: text("password"),
  banned: boolean("banned").notNull().default(false),
}).enableRLS();
// device_id, email and password can be null when the user only uses one type
// may have to make device_id(passkeys) an array to support multiple devices being added
export const commentsTable = pgTable("comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  page: text("page").notNull(),
  user_id: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  deleted: boolean("deleted").notNull().default(false),
  parent_comment_id: uuid("parent_comment_id")
    .references(() => commentsTable.id, { onDelete: "no action" })
    .default(null),
  likes: integer("likes").notNull().default(0),
  dislikes: integer("dislikes").notNull().default(0),
}).enableRLS();
