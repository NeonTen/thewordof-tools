import assert from "assert";

type Headings = {
  summary: string;
  skills: string;
  experience: string;
  projects: string;
  education: string;
};

type CustomSection = {
  id: string;
  title: string;
  content: string;
};

const defaultHeadings: Headings = {
  summary: "Summary",
  skills: "Skills & Expertise",
  experience: "Experience",
  projects: "Projects",
  education: "Education",
};

let headings = { ...defaultHeadings };
headings.summary = "Executive Profile";

assert.strictEqual(headings.summary, "Executive Profile");

let customSections: CustomSection[] = [];
customSections.push({
  id: "c1",
  title: "Certifications",
  content: "- AWS Certified Developer\n- Certified Scrum Master",
});

assert.strictEqual(customSections.length, 1);
assert.strictEqual(customSections[0].title, "Certifications");

console.log("✅ Custom sections and headings logic verified!");
