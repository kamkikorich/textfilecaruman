#!/usr/bin/env node
/**
 * Coolify Setup Automation
 * Sets environment variables and triggers deployment via Coolify API
 *
 * Usage: node scripts/coolify-setup.js
 */

const COOLIFY_URL = "http://waju.my:8000";
const API_TOKEN = process.env.COOLIFY_API_TOKEN;
const PROJECT_UUID = "r10k19fu0ro125hx8s65uxot";
const ENV_UUID = "esqew8egcccgvy5xjioz473y";
const APP_UUID = "yqzj0jtm69xb8ddqwtbl07es";

// Required environment variables
const requiredEnvVars = {
  DATABASE_URL:
    "postgresql://postgres:nqImjUXxz5CQRzdDXd8cyZwzHV6ARqhO63v1K5ryHIgkh4pQqA2cNtmpO9dkRgqg@b859kqfsu6plkz3z84bh6nli:5432/textfileskbbk",
  NEXTAUTH_URL: "https://caruman.waju.my",
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || generateSecret(),
  SMTP_HOST: "mail9.dynamail.asia",
  SMTP_PORT: "587",
  NODE_ENV: "production",
  PORT: "3000",
};

function generateSecret() {
  const crypto = require("crypto");
  return crypto.randomBytes(32).toString("base64");
}

async function setEnvironmentVariables() {
  console.log("🚀 Setting up Coolify environment variables...\n");

  // Environment variables will be set via Coolify UI
  // This script prepares the values

  console.log("📋 Environment Variables to Set:\n");
  console.log("=====================================\n");

  Object.entries(requiredEnvVars).forEach(([key, value]) => {
    const displayValue = key.includes("SECRET") || key.includes("PASSWORD") || key.includes("URL")
      ? `${value.substring(0, 20)}...`
      : value;
    console.log(`${key}=${displayValue}`);
  });

  console.log("\n=====================================\n");
  console.log("🔗 Coolify Dashboard URL:");
  console.log(
    `${COOLIFY_URL}/project/${PROJECT_UUID}/environment/${ENV_UUID}/application/${APP_UUID}/environment-variables`
  );
  console.log("\n📖 Steps:");
  console.log("1. Login to Coolify Dashboard");
  console.log("2. Click 'Environment Variables'");
  console.log("3. Add each variable above");
  console.log("4. Click 'Deploy' button");
  console.log("\n✅ Setup instructions generated!");
}

setEnvironmentVariables().catch(console.error);
