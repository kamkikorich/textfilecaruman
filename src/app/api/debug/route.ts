import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function GET(request: NextRequest) {
  const results: any = {
    timestamp: new Date().toISOString(),
    steps: [],
  };

  try {
    // Step 1: Check database connection
    results.steps.push({ step: 1, name: "Database Connection" });
    const userCount = await db.user.count();
    results.steps.push({
      step: 1,
      status: "success",
      userCount,
    });

    // Step 2: List all users
    results.steps.push({ step: 2, name: "List Users" });
    const users = await db.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: true,
        emailVerified: true,
      },
    });
    results.steps.push({
      step: 2,
      status: "success",
      userCount: users.length,
      users: users.map((u) => ({
        ...u,
        password: u.password ? `${u.password.substring(0, 20)}...` : null,
      })),
    });

    // Step 3: Test password verification
    results.steps.push({ step: 3, name: "Test Password Verification" });
    const testUser = users.find((u) => u.email === "admin@waju.my");
    if (testUser && testUser.password) {
      const testPassword = "password123";
      const isValid = await bcrypt.compare(testPassword, testUser.password);
      results.steps.push({
        step: 3,
        status: "success",
        email: testUser.email,
        passwordTest: isValid,
        message: isValid ? "Password matches!" : "Password does NOT match",
      });
    } else {
      results.steps.push({
        step: 3,
        status: "error",
        message: "User admin@waju.my not found or has no password",
      });
    }

    // Step 4: Environment variables
    results.steps.push({ step: 4, name: "Environment Variables" });
    results.steps.push({
      step: 4,
      status: "success",
      databaseUrl: process.env.DATABASE_URL
        ? `${process.env.DATABASE_URL.substring(0, 30)}...`
        : "NOT SET",
      nextauthUrl: process.env.NEXTAUTH_URL || "NOT SET",
      nodeEnv: process.env.NODE_ENV || "NOT SET",
    });

    results.status = "success";
  } catch (error: any) {
    results.status = "error";
    results.error = error.message;
    results.stack = error.stack;
  }

  return NextResponse.json(results);
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Find user
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        error: "User not found",
        email,
      });
    }

    // Test password
    const isValid = await bcrypt.compare(password, user.password);

    return NextResponse.json({
      success: true,
      email: user.email,
      passwordValid: isValid,
      userFound: !!user,
      storedPassword: user.password
        ? `${user.password.substring(0, 30)}...`
        : null,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
    });
  }
}
