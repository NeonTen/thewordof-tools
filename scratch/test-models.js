const { GoogleGenerativeAI } = require("@google/generative-ai");

async function run() {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_API_KEY || "");
  try {
    const models = await genAI.getModels(); // Wait, GoogleGenerativeAI doesn't have getModels exposed easily? Let's try fetch
  } catch (e) {
    console.error(e);
  }
}
run();
