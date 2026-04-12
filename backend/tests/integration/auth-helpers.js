import jwt from "jsonwebtoken";
import User from "../../models/User.js";

export function authHeader(userDoc) {
  const token = jwt.sign(
    { id: userDoc._id.toString(), role: userDoc.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );
  return { Authorization: `Bearer ${token}` };
}

export async function createUser(overrides = {}) {
  return User.create({
    name: "Test User",
    email: `user-${Date.now()}-${Math.random().toString(36).slice(2)}@test.local`,
    password: "password123",
    role: "student",
    ...overrides,
  });
}
