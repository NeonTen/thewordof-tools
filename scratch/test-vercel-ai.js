const { google } = require("@ai-sdk/google");
const { generateText } = require("ai");
require("dotenv").config();

async function testVercelSDK() {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  console.log("Testing API Key:", apiKey ? `${apiKey.substring(0, 8)}...` : "MISSING");

  try {
    const { text } = await generateText({
      model: google("gemini-1.5-flash"),
      prompt: "Hello, respond with 'SUCCESS'",
    });
    console.log("Result (gemini-1.5-flash):", text);
  } catch (error) {
    console.error("Error with gemini-1.5-flash:", error.message || error);
  }

  try {
    // Testing the model used in the caption generator
    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      prompt: "Hello, respond with 'SUCCESS'",
    });
    console.log("Result (gemini-2.5-flash):", text);
  } catch (error) {
    console.error("Error with gemini-2.5-flash:", error.message || error);
  }
}

testVercelSDK();
