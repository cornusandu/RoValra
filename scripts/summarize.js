import fs from "fs";
import { getLlama, LlamaChatSession } from "node-llama-cpp";

let diff = fs.readFileSync("diff.txt", "utf-8");

// Trim the diff if too long
const max_chars = 12000;
if (diff.length > max_chars) {
  diff = diff.slice(0, max_chars);
}

const prompt = `
You must output only a diff-style summary.

Rules:
- Output lines only in this format:
  @@ <subsystem> @@
  + Added ...
  - Removed ...
  ! Modified ...
- NO explanations
- NO markdown
- NO code blocks
- NO extra text
- NO repetition
- NO "diff --git"
- NO assistant/system tokens
- If unsure, output nothing

Example:

@@ logging @@
+ Added rate limiting
- Removed redundant return

Now convert this diff:

${diff}

Output:
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
