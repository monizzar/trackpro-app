import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient({
  adapter: undefined,
});

async function testLogin() {
  const username = "owner";
  const password = "password123";

  console.log("Testing login for:", username);

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    console.log("❌ User not found");
    return;
  }

  console.log("✅ User found:", {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
  });

  const isPasswordValid = await bcrypt.compare(password, user.password);
  console.log("Password valid:", isPasswordValid ? "✅" : "❌");

  if (!isPasswordValid) {
    console.log("Expected password:", password);
    console.log("Hash in DB:", user.password);
    console.log("\nTrying to rehash and update...");

    const newHash = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: newHash },
    });

    console.log("✅ Password updated successfully");
  }
}

testLogin()
  .then(() => {
    console.log("\nTest completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
