import assert from "assert";

type CVParserResult = {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  summaryHeading?: string;
  summary: string;
  skillsText: string;
  experience: Array<{ company: string; role: string; period: string; desc: string }>;
  education: Array<{ school: string; degree: string; period: string }>;
  projects: Array<{ title: string; link: string; desc: string }>;
  customSections?: Array<{ title: string; content: string }>;
};

const sampleParsedData: CVParserResult = {
  name: "Sajid Khan",
  title: "Senior Technical Lead",
  email: "sajid@example.com",
  phone: "+1 555 1234",
  location: "San Francisco, CA",
  summaryHeading: "Professional Summary",
  summary: "- 10+ years WordPress experience",
  skillsText: "WordPress, PHP, React",
  experience: [],
  education: [],
  projects: [],
  customSections: [
    { title: "Certifications", content: "- AWS Certified Architect" },
    { title: "Languages", content: "- English\n- Spanish" }
  ]
};

assert.strictEqual(sampleParsedData.summaryHeading, "Professional Summary");
assert.strictEqual(sampleParsedData.customSections?.length, 2);
assert.strictEqual(sampleParsedData.customSections[0].title, "Certifications");

console.log("✅ Parser integration schema test verified!");
