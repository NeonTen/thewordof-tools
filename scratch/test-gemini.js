const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function testGemini() {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  console.log("Testing API Key:", apiKey ? `${apiKey.substring(0, 8)}...` : "MISSING");
  
  if (!apiKey) {
    console.error("No API key found in .env");
    return;
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  
  const models = ["gemini-1.5-flash", "gemini-2.5-flash", "gemini-1.5-flash-latest", "gemini-pro", "gemini-1.5-pro"];
  
  for (const modelName of models) {
    console.log(`\n--- Testing Model: ${modelName} ---`);
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Hello, respond with 'SUCCESS'");
      const response = await result.response;
      console.log(`Result: ${response.text()}`);
    } catch (error) {
      console.error(`Error with ${modelName}:`, error.message || error);
    }
  }
}

testGemini();
