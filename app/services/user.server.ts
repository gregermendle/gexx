import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import db from "~/services/db.server";
import { users, passwords, type User } from "~/db/schema";

export async function getUserById(id: User["id"]) {
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result[0] || null;
}

export async function getUserByEmail(email: User["email"]) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  return result[0] || null;
}

export async function createUser(
  { email, name }: Pick<User, "name" | "email">,
  password: string
) {
  const hashedPassword = await bcrypt.hash(password, 10);
  return await db.transaction(async (tx) => {
    const [user] = await tx.insert(users).values({ email, name }).returning();

    await tx.insert(passwords).values({
      hash: hashedPassword,
      userId: user.id,
    });

    return user;
  });
}

export async function deleteUserByEmail(email: User["email"]) {
  // With cascade delete, this will also delete the password
  const [deletedUser] = await db
    .delete(users)
    .where(eq(users.email, email))
    .returning();

  return deletedUser;
}

export async function verifyLogin(
  email: User["email"],
  password: string
): Promise<User> {
  const userWithPassword = await db.query.users.findFirst({
    where: eq(users.email, email),
    with: {
      password: true,
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    throw new Error("Credentials are invalid.");
  }

  const isValid = await bcrypt.compare(
    password,
    userWithPassword.password.hash
  );

  if (!isValid) {
    throw new Error("Credentials are invalid.");
  }

  const { password: _password, ...userWithoutPassword } = userWithPassword;
  return userWithoutPassword;
}
