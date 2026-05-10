import { streamText } from "ai"
import { google } from "@ai-sdk/google"

async function test() {
  const result = streamText({
    model: google("gemini-2.5-flash"),
    prompt: "Hello",
  })
  console.log("Methods:", Object.keys(result))
  console.log("Has toTextStreamResponse:", typeof result.toTextStreamResponse === 'function')
  console.log("Has toDataStreamResponse:", typeof (result as any).toDataStreamResponse === 'function')
  console.log("Has toDataStream:", typeof (result as any).toDataStream === 'function')
}

test()
