"use client";
import { personalData } from "@/libs/homepage/data/personal-data";
import Link from "next/link";
import {
  BiLogoDiscord,
  BiLogoInstagram,
  BiLogoYoutube,
  BiLogoSpotify,
} from "react-icons/bi";

import { IoLogoGithub, IoMdCall } from "react-icons/io";
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
      className="my-12 lg:my-16 relative mt-24 dark:text-white text-black w-full"
      data-aos="fade-up"
    >
      <div
        className="hidden lg:flex flex-col items-center absolute top-24 -right-8"
        data-aos="fade-up"
        data-aos-anchor-placement="center-right"
      >
        <span className="bg-[#1a1443] w-fit text-white rotate-90 p-2 px-5 text-xl rounded-md">
          CONTACT
        </span>
        <span className="h-36 w-[2px] bg-[#1a1443]"></span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        <div className="lg:w-3/4 ">
          <div className="flex flex-col gap-5 lg:gap-9">
            <p className="text-sm md:text-xl flex items-center gap-3">
              <MdAlternateEmail
                className="bg-[#8b98a5] p-2 rounded-full hover:bg-[#16f2b3] hover:scale-110 transition-all duration-300 text-gray-800 cursor-pointer"
                size={36}
              />
              <span>{personalData.email}</span>
            </p>
          </div>
          <div className="mt-8 lg:mt-16 flex items-center gap-5 lg:gap-10">
            <Link target="_blank" href={personalData.github}>
              <IoLogoGithub
                className="bg-[#8b98a5] p-3 rounded-full hover:bg-[#16f2b3] hover:scale-110 transition-all duration-300 text-gray-800 cursor-pointer"
                size={48}
              />
            </Link>
            <Link target="_blank" href={personalData.instagram}>
              <BiLogoInstagram
                className="bg-[#8b98a5] p-3 rounded-full hover:bg-[#16f2b3] hover:scale-110 transition-all duration-300 text-gray-800 cursor-pointer"
                size={48}
              />
            </Link>
            {/* <Link target="_blank" href={personalData.discord}>
              <BiLogoDiscord
                className="bg-[#8b98a5] p-3 rounded-full hover:bg-[#16f2b3] hover:scale-110 transition-all duration-300 text-gray-800 cursor-pointer"
                size={48}
              />
            </Link> */}
            <Link target="_blank" href={personalData.discordServer}>
              <BiLogoDiscord
                className="bg-[#8b98a5] p-3 rounded-full hover:bg-[#16f2b3] hover:scale-110 transition-all duration-300 text-gray-800 cursor-pointer"
                size={48}
              />
            </Link>
            <Link target="_blank" href={personalData.youtube}>
              <BiLogoYoutube
                className="bg-[#8b98a5] p-3 rounded-full hover:bg-[#16f2b3] hover:scale-110 transition-all duration-300 text-gray-800 cursor-pointer"
                size={48}
              />
            </Link>
            <Link target="_blank" href={personalData.spotify}>
              <BiLogoSpotify
                className="bg-[#8b98a5] p-3 rounded-full hover:bg-[#16f2b3] hover:scale-110 transition-all duration-300 text-gray-800 cursor-pointer"
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
