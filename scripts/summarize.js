import fs from "fs";
import { getLlama, LlamaChatSession } from "node-llama-cpp";

let diff = fs.readFileSync("diff.txt", "utf-8");

// Trim the diff if too long
const max_chars = 12000;
if (diff.length > max_chars) {
  diff = diff.slice(0, max_chars);
}

const prompt = `
You generate structured change summaries from git diffs.

Rules:
- Group by subsystem inferred from file paths
- Use EXACT format:

@@ <subsystem> @@
+ Added ...
- Removed ...
! Modified ...

- Max 10 words per line
- No explanations
- No filenames
- No extra text
- Only include meaningful changes

Example:

Input:
diff --git a/src/logging/logger.ts b/src/logging/logger.ts
+ added rate limit
- removed return

Output:
@@ logging @@
+ Added rate limiting
- Removed redundant return

Now process:

${diff}
`;



const llama = await getLlama();

const model = await llama.loadModel({
  modelPath: "./models/model.gguf",
});

const context = await model.createContext();
const contextSequence = await context.getSequence();

const session = new LlamaChatSession({
  contextSequence,
});

const response = await session.prompt(prompt);

const output = [
  "```diff",
  response.trim(),
  "```"
].join("\n");

fs.writeFileSync("pr-summary.txt", output);
console.log(output);
