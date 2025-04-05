// start.js
const path = require("path");
const { execSync } = require("child_process");

const entry = path.join(__dirname, "dist", "script.js");

try {
  execSync(`node "${entry}"`, { stdio: "inherit" });
} catch (error) {
  console.error("\nFailed to run script:");
  console.error(error.message || error);
  process.exit(1);
}
