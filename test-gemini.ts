import { generateText } from "ai"
import { google } from "@ai-sdk/google"

async function test() {
  try {
    const { text } = await generateText({
      model: google("gemini-pro"),
      prompt: "Say hello",
    })
    console.log("Success:", text)
  } catch (error) {
    console.error("Gemini Error:", error)
  }
}

test()
