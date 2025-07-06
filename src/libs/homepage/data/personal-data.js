import mayfeGif from "@/images/logos/mayfeGif.gif";

export const personalData = {
  name: "Seyfettin Budak",
  profile: mayfeGif,
  designation: [
    "Full Stack Developer",
    "Statistics Student",
    "Computer Science Student",
  ],
  description:
    "My name is Seyfettin Budak. I am a full stack developer with a strong interest in both software and hardware integration. I am currently studying Statistics and Computer Science simultaneously. In addition to software development, data science, and machine learning, I am also deeply interested in embedded systems, Unreal Engine 5, and VR game development.",
  email: "seyfettinbudak11@gmail.com",
  github: "https://github.com/bymayfe",
  instagram: "https://www.instagram.com/seyfettinbudakk/",
  youtube: "https://www.youtube.com/@ByMayFe",
  spotify: "https://open.spotify.com/user/n7gka8kri7snlyf8mjuu3ct75",
  discord: "https://discord.com/users/402047297963294730",
  discordServer: "https://discord.gg/7shjKJCydR",
  spotifyStatsV1: "https://mayfedev.vercel.app/stats/100000",
  spotifyStatsV2: "https://mayfedev.vercel.app/spotify/100000",
  devUsername: "bymayfe",
  coder: {
    name: "Seyfettin Budak",
    role: "Full Stack Developer",
    location: "Türkiye",
    experienceYears: 3,

    skills: {
      statistics: [
        "R",
        "SPSS",
        "MATLAB",
        "Eviews",
        "Excel",
        "Python (Pandas, NumPy, Matplotlib, Seaborn)",
      ],
      web: ["HTML", "CSS", "Tailwind", "React", "NextJS", "NodeJS", "Express"],
      programming: [
        "Javascript",
        "Typescript",
        "Python",
        "C#",
        "Visual Basic",
        "R",
      ],
      embedded: ["Arduino", "Raspberry Pi", "C++", "ESP32"],
      gameDev: [
        "Unreal Engine 5",
        "Blueprint",
        "VR Game Design",
        "Meta Quest 3",
      ],
    },

    education: [
      {
        major: "Statistics",
        degree: "B.Sc",
        institution: "Bilecik Şeyh Edebali University",
        gpa: 3.5,
      },
      {
        major: "Computer Science",
        degree: "B.Sc",
        institution: "Bilecik Şeyh Edebali University",
        gpa: 3.5,
      },
    ],

    // certifications: [
    //   "Meta Front-End Developer (Coursera)",
    //   "Google Data Analytics",
    //   "Harvard CS50",
    // ],

    hardWorker: true,
    quickLearner: true,
    problemSolver: true,
    isStudent: true,
    isWorker: true,

    hireable: () => {
      return (
        personalData.coder.hardWorker &&
        personalData.coder.problemSolver &&
        Object.values(personalData.coder.skills).flat().length >= 5 &&
        !personalData.coder.isStudent
      );
    },

    summary: () => {
      return `${personalData.coder.name} is a ${personalData.coder.role} experienced in full-stack development, statistics, and VR game design.`;
    },
  },
};
