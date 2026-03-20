import fs from "fs";
import { getLlama } from "node-llama-cpp";

// Read diff
let diff = fs.readFileSync("diff.txt", "utf-8");

// Aggressive trim (critical for stability)
diff = diff.split("\n").slice(0, 60).join("\n");

// Initialize llama
const llama = await getLlama();

const model = await llama.loadModel({
  modelPath: "./models/model.gguf",
});

const context = await model.createContext();
const sequence = await context.getSequence();

// Strongly constrained completion prompt
const completionPrompt = `You must output ONLY this format:

@@ subsystem @@
+ Added ...
- Removed ...
! Modified ...

Rules:
- No explanations
- No extra text
- No markdown
- No "diff --git"
- If unsure, output nothing

Diff:
${diff}

Output:
@@`;

// Run inference (raw completion, NOT chat)
const tokens = await sequence.evaluate(completionPrompt, {
  maxTokens: 80,
  temperature: 0.0,
});

// Convert tokens → string
const text = tokens.join("").trim();

// Wrap in diff block
const output = [
  "```diff",
  text,
  "```"
].join("\n");

// Save + print
fs.writeFileSync("pr-summary.txt", output);
console.log(output);
