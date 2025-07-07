import fs from "fs";
import path from "path";

export type Skill = {
  name: string;
  image: string;
};

export function getSkills(): Skill[] {
  const skillsDir = path.join(process.cwd(), "public/images/skills");

  if (!fs.existsSync(skillsDir)) {
    console.warn("Skills directory not found:", skillsDir);
    return [];
  }

  const files = fs.readdirSync(skillsDir);

  return files
    .filter((file) => file.endsWith(".png"))
    .sort((a, b) => {
      const aNum = parseInt(a.split("_")[0]);
      const bNum = parseInt(b.split("_")[0]);
      return aNum - bNum;
    })
    .map((file) => ({
      name: file.split("_")[1].replace(".png", ""),
      image: `/images/skills/${file}`,
    }));
}
