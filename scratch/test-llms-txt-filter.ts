import { cleanAndFilterUrls } from "../src/app/api/ai/llms-txt/route";

const mockUrls = [
  "https://zahrafoundationltd.org/",
  "https://zahrafoundationltd.org/donate/",
  "https://zahrafoundationltd.org/?page_id=601",
  "https://zahrafoundationltd.org/#main",
  "https://zahrafoundationltd.org/wp-content/plugins/kadence-blocks/includes/assets/css/kadence-splide.min.css?ver=3.6.7",
  "https://zahrafoundationltd.org/?feed=rss2",
  "https://zahrafoundationltd.org/index.php?rest_route=%2Foembed%2F1.0%2Fembed&url=https%3A%2F%2Fzahrafoundationltd.org%2F",
  "https://zahrafoundationltd.org/xmlrpc.php?rsd",
  "https://externaldomain.com/page",
  "https://zahrafoundationltd.org/about#team",
  "https://zahrafoundationltd.org/document.pdf",
];

const expected = [
  "https://zahrafoundationltd.org/",
  "https://zahrafoundationltd.org/donate/",
  "https://zahrafoundationltd.org/about",
];

try {
  console.log("Running TDD test for cleanAndFilterUrls...");
  const result = cleanAndFilterUrls(mockUrls, "https://zahrafoundationltd.org/");
  
  console.log("Result:", result);
  console.log("Expected:", expected);
  
  if (JSON.stringify(result.sort()) === JSON.stringify(expected.sort())) {
    console.log("✅ TEST PASSED!");
    process.exit(0);
  } else {
    console.error("❌ TEST FAILED: Result did not match expected output.");
    process.exit(1);
  }
} catch (error) {
  console.error("❌ TEST ERRORED:", error);
  process.exit(1);
}
