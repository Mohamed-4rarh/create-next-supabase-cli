#!/usr/bin/env node

import chalk from "chalk";
import prompts from "prompts";
import { execSync } from "child_process";
import degit from "degit";
import fs from "fs-extra";

// CLI Banner
console.log(chalk.blue.bold("\n🚀 Create Next.js + Supabase Project\n"));

(async () => {
  const response = await prompts([
    {
      type: "text",
      name: "projectName",
      message: "Enter your project name:",
      validate: (name) => (name ? true : "Project name is required!"),
    },
    {
      type: "multiselect",
      name: "features",
      message: "Select Supabase features to include:",
      choices: [
        { title: "Authentication", value: "auth", selected: true },
        { title: "Database", value: "database", selected: true },
        { title: "Storage", value: "storage", selected: false },
      ],
      min: 1,
    },
    {
      type: "toggle",
      name: "tailwind",
      message: "Would you like to install Tailwind CSS?",
      initial: true,
      active: "Yes",
      inactive: "No",
    },
    {
      type: "toggle",
      name: "shadcn",
      message: "Would you like to install shadcn/ui?",
      initial: true,
      active: "Yes",
      inactive: "No",
    },
  ]);

  const { projectName, features, tailwind, shadcn } = response;
  if (!projectName) process.exit(1);

  console.log(chalk.green(`\n📦 Setting up ${projectName}...\n`));

  // Clone the starter repo
  const repo = "https://github.com/Mohamed-4rarh/next-supabase-starter";
  const emitter = degit(repo, { cache: false, force: true });

  try {
    await emitter.clone(projectName);
    console.log(chalk.green("✅ Starter project cloned successfully!"));

    process.chdir(projectName);

    if (!features.includes("auth")) fs.removeSync("lib/auth.ts");
    if (!features.includes("database")) fs.removeSync("lib/database.ts");
    if (!features.includes("storage")) fs.removeSync("lib/storage.ts");

    console.log(chalk.blue("\n📦 Installing dependencies...\n"));
    execSync("pnpm install", { stdio: "inherit" });

    if (tailwind) {
      console.log(chalk.blue("\n🎨 Setting up Tailwind CSS...\n"));
      execSync("pnpm add -D tailwindcss postcss autoprefixer", {
        stdio: "inherit",
      });
      execSync("npx tailwindcss init -p", { stdio: "inherit" });
    }

    if (shadcn) {
      console.log(chalk.blue("\n✨ Installing shadcn/ui...\n"));
      execSync("pnpm dlx shadcn-ui@latest init -y", { stdio: "inherit" });
      execSync("pnpm add @shadcn/ui", { stdio: "inherit" });
    }

    console.log(chalk.blue("\n🔗 Initializing Git...\n"));
    execSync("git init && git add . && git commit -m 'Initial commit'", {
      stdio: "inherit",
    });

    console.log(chalk.green("\n🚀 Setup complete! Run:\n"));
    console.log(chalk.cyan(`  cd ${projectName}`));
    console.log(chalk.cyan("  pnpm dev\n"));
  } catch (error) {
    console.error(chalk.red("❌ Error setting up project:", error));
  }
})();
