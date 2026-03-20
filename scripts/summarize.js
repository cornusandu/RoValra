import fs from "fs";
import { getLlama, LlamaChatSession } from "node-llama-cpp";

let diff = fs.readFileSync("diff.txt", "utf-8");

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
- If unsure, output nothing

Example:

@@ logging @@
+ Added rate limiting
- Removed redundant return
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

const response = await session.prompt(`${diff}\n\nStart output with:\n@@`, {
  systemPrompt: prompt,
  maxTokens: 250,
  temperature: 0.1,
  topP: 0.9,
});

const output = [
  "```diff",
  response.trim(),
  "```"
].join("\n");

fs.writeFileSync("pr-summary.txt", output);
console.log(output);
