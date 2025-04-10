import { primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";
import { relations, type InferSelectModel } from "drizzle-orm";

const cuid = () =>
  text()
    .$defaultFn(() => createId())
    .notNull()
    .primaryKey();

export const users = sqliteTable("users", {
  id: cuid(),
  name: text().notNull(),
  email: text().notNull().unique(),
  createdAt: text("created_at").default(new Date().toISOString()),
  updatedAt: text("updated_at").default(new Date().toISOString()),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  password: one(passwords, {
    fields: [users.id],
    references: [passwords.userId],
  }),
  teamMembers: many(teamMembers),
}));

export const passwords = sqliteTable("passwords", {
  id: cuid(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  hash: text("hash").notNull(),
  createdAt: text("created_at").default(new Date().toISOString()),
  updatedAt: text("updated_at").default(new Date().toISOString()),
});

export const teams = sqliteTable("teams", {
  id: cuid(),
  name: text().notNull(),
  createdAt: text("created_at").default(new Date().toISOString()),
  updatedAt: text("updated_at").default(new Date().toISOString()),
});

export const teamsRelations = relations(teams, ({ many }) => ({
  members: many(teamMembers),
}));

export const teamMembers = sqliteTable(
  "team_members",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    teamId: text("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    role: text().default("member"), // Optional: roles like "admin", "member", etc.
    createdAt: text("created_at").default(new Date().toISOString()),
    updatedAt: text("updated_at").default(new Date().toISOString()),
  },
  (table) => [primaryKey({ columns: [table.userId, table.teamId] })]
);

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  user: one(users, {
    fields: [teamMembers.userId],
    references: [users.id],
  }),
  team: one(teams, {
    fields: [teamMembers.teamId],
    references: [teams.id],
  }),
}));

export type User = InferSelectModel<typeof users>;
export type Team = InferSelectModel<typeof teams>;
export type TeamMember = InferSelectModel<typeof teamMembers>;
