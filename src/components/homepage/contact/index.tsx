"use client";
import { personalData } from "@/libs/homepage/data/personal-data";
import Link from "next/link";
import {
  BiLogoDiscord,
  BiLogoInstagram,
  BiLogoYoutube,
  BiLogoSpotify,
} from "react-icons/bi";

import { IoLogoGithub } from "react-icons/io";
import { MdAlternateEmail } from "react-icons/md";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

function ContactSection() {
  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <div
      id="contact"
      className="my-12 lg:my-16 relative mt-24 dark:bg-[#0d1224] text-gray-800 dark:text-white w-full"
      data-aos="fade-up"
    >
      <div
        className="hidden lg:flex flex-col items-center absolute top-24 -right-8"
        data-aos="fade-up"
        data-aos-anchor-placement="center-right"
      >
        <span className="bg-white dark:bg-[#1a1443] text-gray-800 dark:text-white w-fit rotate-90 p-2 px-5 text-xl rounded-md shadow-sm">
          CONTACT
        </span>
        <span className="h-36 w-[2px] bg-gray-300 dark:bg-[#1a1443]" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        <div className="lg:w-3/4">
          <div className="flex flex-col gap-5 lg:gap-9">
            <p className="text-sm md:text-xl flex items-center gap-3">
              <MdAlternateEmail
                className="bg-gray-300 dark:bg-[#8b98a5] p-2 rounded-full hover:bg-[#16f2b3] hover:scale-110 transition-all duration-300 text-gray-800 dark:text-white cursor-pointer"
                size={36}
              />
              <span>{personalData.email}</span>
            </p>
          </div>

          <div className="mt-8 lg:mt-16 flex items-center gap-5 lg:gap-10">
            <Link target="_blank" href={personalData.github}>
              <IoLogoGithub
                className="bg-gray-300 dark:bg-[#8b98a5] p-3 rounded-full hover:bg-[#16f2b3] hover:scale-110 transition-all duration-300 text-gray-800 dark:text-white cursor-pointer"
                size={48}
              />
            </Link>
            <Link target="_blank" href={personalData.instagram}>
              <BiLogoInstagram
                className="bg-gray-300 dark:bg-[#8b98a5] p-3 rounded-full hover:bg-[#16f2b3] hover:scale-110 transition-all duration-300 text-gray-800 dark:text-white cursor-pointer"
                size={48}
              />
            </Link>
            <Link target="_blank" href={personalData.discordServer}>
              <BiLogoDiscord
                className="bg-gray-300 dark:bg-[#8b98a5] p-3 rounded-full hover:bg-[#16f2b3] hover:scale-110 transition-all duration-300 text-gray-800 dark:text-white cursor-pointer"
                size={48}
              />
            </Link>
            <Link target="_blank" href={personalData.youtube}>
              <BiLogoYoutube
                className="bg-gray-300 dark:bg-[#8b98a5] p-3 rounded-full hover:bg-[#16f2b3] hover:scale-110 transition-all duration-300 text-gray-800 dark:text-white cursor-pointer"
                size={48}
              />
            </Link>
            <Link target="_blank" href={personalData.spotify}>
              <BiLogoSpotify
                className="bg-gray-300 dark:bg-[#8b98a5] p-3 rounded-full hover:bg-[#16f2b3] hover:scale-110 transition-all duration-300 text-gray-800 dark:text-white cursor-pointer"
                size={48}
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactSection;
