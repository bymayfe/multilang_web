import htmlIcon from "@/images/skills/html.png";
import cssIcon from "@/images/skills/css.png";
import reactIcon from "@/images/skills/react.png";
import nextjsIcon from "@/images/skills/nextjs.png";
import tailwindIcon from "@/images/skills/tailwind.png";
import mongodbIcon from "@/images/skills/mongodb.png";
import gitIcon from "@/images/skills/git.png";
import bootstrapIcon from "@/images/skills/bootstrap.png";
import firebaseIcon from "@/images/skills/firebase.png";
import nodejsIcon from "@/images/skills/nodejs.png";
import jsIcon from "@/images/skills/js.png";
import tsIcon from "@/images/skills/ts.png";
import pyIcon from "@/images/skills/py.png";
import csIcon from "@/images/skills/cs.png";
import discordjsIcon from "@/images/skills/discordjs.png";
import prIcon from "@/images/skills/pr.png";

export const skillsData = [
  {
    name: "HTML",
    id: "html",
  },
  {
    name: "CSS",
    id: "css",
  },
  {
    name: "React",
    id: "react",
  },
  {
    name: "Next JS",
    id: "nextjs",
  },
  {
    name: "Tailwind",
    id: "tailwind",
  },
  {
    name: "MongoDB",
    id: "mongodb",
  },
  {
    name: "Git",
    id: "git",
  },
  {
    name: "Bootstrap",
    id: "bootstrap",
  },
  {
    name: "Firebase",
    id: "firebase",
  },
  {
    name: "Node JS",
    id: "nodejs",
  },
  {
    name: "Javascript",
    id: "js",
  },
  {
    name: "Typescript",
    id: "ts",
  },
  {
    name: "Python",
    id: "py",
  },
  {
    name: "C#",
    id: "cs",
  },
  {
    name: "Discord JS",
    id: "discordjs",
  },
  {
    name: "Premire",
    id: "pr",
  },
];

export const skillsImage = (skill) => {
  switch (skill) {
    case "html":
      return htmlIcon;
    case "css":
      return cssIcon;
    case "react":
      return reactIcon;
    case "nextjs":
      return nextjsIcon;
    case "tailwind":
      return tailwindIcon;
    case "mongodb":
      return mongodbIcon;
    case "git":
      return gitIcon;
    case "bootstrap":
      return bootstrapIcon;
    case "firebase":
      return firebaseIcon;
    case "nodejs":
      return nodejsIcon;
    case "js":
      return jsIcon;
    case "ts":
      return tsIcon;
    case "py":
      return pyIcon;
    case "cs":
      return csIcon;
    case "discordjs":
      return discordjsIcon;
    case "pr":
      return prIcon;
    default:
      return "#";
  }
};
