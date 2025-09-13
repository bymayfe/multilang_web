import AboutSection from "@/components/homepage/about";
import ContactSection from "@/components/homepage/contact";
import Education from "@/components/homepage/education";
import Experience from "@/components/homepage/experience";
import HeroSection from "@/components/homepage/hero-section";
import Projects from "@/components/homepage/projects";
import Skills from "@/components/homepage/skills";
import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import ScrollButton from "@/components/ScrollButton";

import { getSkills } from "@/scripts/useful/getSkills";
import type { Skill } from "@/scripts/useful/getSkills";

const menuList = [
  { name: "About", href: "/home#about", key: "about" },
  { name: "Experience", href: "/home#experience", key: "experience" },
  { name: "Skills", href: "/home#skills", key: "skills" },
  { name: "Education", href: "/home#education", key: "education" },
  // { name: "Blogs", href: "/blog", key: "blogs" },
  { name: "Projects", href: "/home#projects", key: "projects" },
];

export default function Home() {
  const skills: Skill[] = getSkills(); // ✅ Senkron fonksiyon, async gerekmez

  return (
    <div className="w-full">
      <ScrollButton />
      <NavBar menuList={menuList} className="py-3 px-20 w-full" />
      <div className="min-h-screen relative mx-auto px-6 sm:px-12 lg:max-w-[70rem] xl:max-w-[76rem] 2xl:max-w-[92rem] text-white">
        <HeroSection />
        <AboutSection />
        <Skills skills={skills} />
        <Education />
        <Experience />
        <Projects />
        {/* <Blog blogs={blogs} /> */}
        <ContactSection />
        <Footer />
      </div>
    </div>
  );
}
