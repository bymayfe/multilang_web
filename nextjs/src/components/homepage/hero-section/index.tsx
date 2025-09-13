"use client";
import { useTypewriter, Cursor } from "react-simple-typewriter";
import { personalData } from "@/libs/homepage/data/personal-data";
import Image from "next/image";
import Link from "next/link";
import { BsGithub, BsDiscord, BsInstagram } from "react-icons/bs";
import { FaDiscord, FaSpotify } from "react-icons/fa";
import { RiContactsFill } from "react-icons/ri";

import heroSVG from "@/images/svg/hero.svg";

function HeroSection() {
  const { coder } = personalData;

  const basicFields = ["name", "role", "location", "experienceYears"] as const;
  type BasicField = (typeof basicFields)[number];

  const [typeEffect] = useTypewriter({
    words: personalData.designation,
    loop: true, // ✅ burada boolean verdik
    typeSpeed: 100,
    deleteSpeed: 40,
    delaySpeed: 1500,
  });
  return (
    <section className="relative flex flex-col items-center justify-between py-4 lg:py-12">
      <Image
        src={heroSVG}
        alt="Hero"
        width={1572}
        height={795}
        className="absolute -top-[98px] -z-10"
      />

      <div className="grid grid-cols-1 items-start lg:grid-cols-2 lg:gap-12 gap-y-8">
        <div className="order-2 lg:order-1 flex flex-col items-start justify-center p-2 pb-20 md:pb-10 lg:pt-10">
          <h1 className="text-3xl font-bold leading-10 dark:text-white text-black md:font-extrabold lg:text-[2.6rem] lg:leading-[3.5rem]">
            Hello, <br />
            This is <span className=" text-pink-500">{personalData.name}</span>
            {/* {` , I'm a Professional `} */}
            {/* <span className=" text-[#16f2b3]">{personalData.designation}</span>. */}
            <p className="h-10 text-3xl md:text-3xl max-sm:text-xl mt-3 bg-clip-text text-transparent bg-gradient-to-r from-[#00040f] to-slate-500 dark:from-slate-500 dark:to-slate-200 max-w-[97%] md:max-w-[600px] text-left">
              I am a{" "}
              <span className="text-3xl md:text-3xl max-sm:text-xl bg-clip-text text-[#16f2b3] font-bold -z-50">
                {typeEffect}
              </span>
              <Cursor />
            </p>
            <p className="ABOUT text-lg mt-2 max-sm:text-sm bg-clip-text text-transparent bg-gradient-to-r from-[#00040f] to-slate-500 dark:from-slate-500 dark:to-slate-200 max-w-[80%] md:max-w-[470px] text-left">
              Programming enthusiast who often thinks about developing new
              things for solving real-world problems.
            </p>
          </h1>

          <div className="my-12 flex items-center gap-5">
            <Link
              href={personalData.github}
              target="_blank"
              className="transition-all text-pink-500 hover:scale-125 duration-300"
            >
              <BsGithub size={30} />
            </Link>
            <Link
              href={personalData.instagram}
              target="_blank"
              className="transition-all text-pink-500 hover:scale-125 duration-300"
            >
              <BsInstagram size={30} />
            </Link>
            <Link
              href={personalData.discord}
              target="_blank"
              className="transition-all text-pink-500 hover:scale-125 duration-300"
            >
              <BsDiscord size={30} />
            </Link>
            <Link
              href={personalData.discordServer}
              target="_blank"
              className="transition-all text-pink-500 hover:scale-125 duration-300"
            >
              <FaDiscord size={30} />
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="#contact"
              className="bg-gradient-to-r from-violet-600 to-pink-500 p-[1px] rounded-full transition-all duration-300 hover:from-pink-500 hover:to-violet-600"
            >
              <button className="px-3 text-xs md:px-8 py-3 md:py-4 rounded-full border-none text-center md:text-sm font-medium uppercase tracking-wider text-gray-800 dark:text-white bg-white dark:bg-[#0d1224] no-underline transition-all duration-200 ease-out md:font-semibold flex items-center gap-1 hover:gap-3">
                {/* 🔧 text rengi tema uyumlu — light: koyu, dark: açık */}
                {/* 🔧 buton arka planı tema duyarlı — light: beyaz, dark: koyu mor/navy */}
                <span>Contact me</span>
                <RiContactsFill size={16} />
              </button>
            </Link>

            <Link
              className="flex items-center gap-1 hover:gap-3 rounded-full bg-gradient-to-r from-pink-500 to-violet-600 px-3 md:px-8 py-3 md:py-4 text-center text-xs md:text-sm font-medium uppercase tracking-wider text-white no-underline transition-all duration-200 ease-out hover:text-white hover:no-underline md:font-semibold"
              role="button"
              target="_blank"
              href={personalData.spotifyStatsV2}
            >
              <span>Spotify Project V2</span>
              <FaSpotify size={16} />
            </Link>
            {/* 
            <div className="flex items-center gap-1 hover:gap-3 rounded-full bg-gradient-to-r from-pink-500 to-violet-600 px-3 md:px-8 py-3 md:py-4 text-center text-xs md:text-sm font-medium uppercase tracking-wider text-white no-underline transition-all duration-200 ease-out hover:text-white hover:no-underline md:font-semibold">
              <span className="hover:hidden">Spotify Project</span>
              <div className="hidden hover:flex">
                <Link
                  className=""
                  role="button"
                  target="_blank"
                  href={personalData.spotifyStatsV1}
                />
                <Link
                  className=""
                  role="button"
                  target="_blank"
                  href={personalData.spotifyStatsV2}
                />
              </div>

              <FaSpotify size={16} />
            </div> */}
          </div>
        </div>
        <div className="order-1 lg:order-2 relative rounded-lg border bg-gradient-to-r from-[#f4f4f5] to-[#e5e7eb] border-gray-300 dark:from-[#0d1224] dark:to-[#0a0d37] dark:border-[#1b2c68a0]">
          {/* 🎨 Üst çizgiler */}
          <div className="flex flex-row">
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-pink-500 to-violet-600"></div>
            <div className="h-[1px] w-full bg-gradient-to-r from-violet-600 to-transparent"></div>
          </div>

          {/* 🟢🔴🟠 Sol üst butonlar */}
          <div className="px-4 lg:px-8 py-5">
            <div className="flex flex-row space-x-2">
              <div className="h-3 w-3 rounded-full bg-red-400"></div>
              <div className="h-3 w-3 rounded-full bg-orange-400"></div>
              <div className="h-3 w-3 rounded-full bg-green-200"></div>
            </div>
          </div>

          {/* 💻 Kod Gövdesi */}
          <div className="overflow-hidden border-t-[2px] border-indigo-200 dark:border-indigo-900 px-4 lg:px-8 py-4 lg:py-8">
            <code className="font-mono text-xs md:text-sm lg:text-base">
              <div className="blink">
                <span className="mr-2 text-pink-500">const</span>
                <span className="mr-2 text-black dark:text-white">coder</span>
                <span className="mr-2 text-pink-500">=</span>
                <span className="text-gray-600 dark:text-gray-400">{"{"}</span>
              </div>

              {/* Object.entries döngüsü aynı kalıyor, sadece renkler güncellenecek */}
              {Object.entries(coder).map(([key, value]) => {
                const indent = "ml-4 lg:ml-8";

                if (Array.isArray(value)) {
                  return (
                    <div key={key} className={indent}>
                      <span className="dark:text-white text-black">{key}:</span>{" "}
                      <span className="text-gray-600 dark:text-gray-400">
                        [
                      </span>
                      <div className="ml-4">
                        {value.map((item, i) =>
                          typeof item === "string" ? (
                            <span
                              key={i}
                              className="text-amber-700 dark:text-amber-300"
                            >
                              {i > 0 && (
                                <span className="text-gray-600 dark:text-gray-400">
                                  {"', '"}
                                </span>
                              )}
                              {item}
                            </span>
                          ) : typeof item === "object" && item !== null ? (
                            <div key={i} className="ml-4">
                              <span className="text-gray-600 dark:text-gray-400">
                                {"{"}
                              </span>
                              {Object.entries(item).map(([k, v], j) => (
                                <span key={j}>
                                  <span className="text-black dark:text-white ml-2">
                                    {k}:
                                  </span>{" "}
                                  <span className="text-gray-600 dark:text-gray-400">
                                    '
                                  </span>
                                  <span className="text-amber-700 dark:text-amber-300">
                                    {String(v)}
                                  </span>
                                  <span className="text-gray-600 dark:text-gray-400">
                                    ',
                                  </span>
                                </span>
                              ))}
                              <span className="text-gray-600 dark:text-gray-400">
                                {" },"}
                              </span>
                            </div>
                          ) : null
                        )}
                      </div>
                      <span className="text-gray-600 dark:text-gray-400">
                        ],
                      </span>
                    </div>
                  );
                }

                if (
                  key === "skills" &&
                  typeof value === "object" &&
                  value !== null
                ) {
                  return (
                    <div key={key} className={indent}>
                      <span className="dark:text-white text-black">
                        skills:
                      </span>{" "}
                      <span className="text-gray-600 dark:text-gray-400">
                        {"{"}
                      </span>
                      {Object.entries(value).map(([cat, arr], ci) => (
                        <div key={ci} className="ml-4">
                          <span className="dark:text-white text-black">
                            {cat}:
                          </span>{" "}
                          <span className="text-gray-600 dark:text-gray-400">
                            [
                          </span>
                          {arr.map((skill, si) => (
                            <span
                              key={si}
                              className="text-amber-700 dark:text-amber-300"
                            >
                              {si > 0 && (
                                <span className="text-gray-600 dark:text-gray-400">
                                  {"', '"}
                                </span>
                              )}
                              {skill}
                            </span>
                          ))}
                          <span className="text-gray-600 dark:text-gray-400">
                            ],
                          </span>
                        </div>
                      ))}
                      <span className="text-gray-600 dark:text-gray-400">
                        {"},"}
                      </span>
                    </div>
                  );
                }

                if (typeof value === "function") {
                  return (
                    <div key={key} className={indent}>
                      <span className="text-black dark:text-white">{key}:</span>{" "}
                      <span className="text-orange-600 dark:text-orange-400">
                        {String(value())},
                      </span>
                    </div>
                  );
                }

                if (typeof value === "boolean") {
                  return (
                    <div key={key} className={indent}>
                      <span className="text-black dark:text-white">{key}:</span>{" "}
                      <span className="text-orange-600 dark:text-orange-400">
                        {String(value)},
                      </span>
                    </div>
                  );
                }

                if (typeof value === "object" && value !== null) {
                  return (
                    <div key={key} className={indent}>
                      <span className="text-black dark:text-white">{key}:</span>{" "}
                      <span className="text-gray-600 dark:text-gray-400">
                        {"{"}
                      </span>
                      {Object.entries(value).map(([k, v], j) => (
                        <div key={j} className="ml-4">
                          <span className="text-black dark:text-white">
                            {k}:
                          </span>{" "}
                          <span className="text-gray-600 dark:text-gray-400">
                            '
                          </span>
                          <span className="text-amber-700 dark:text-amber-300">
                            {String(v)}
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">
                            ',
                          </span>
                        </div>
                      ))}
                      <span className="text-gray-600 dark:text-gray-400 ml-4">
                        {"},"}
                      </span>
                    </div>
                  );
                }

                return (
                  <div key={key} className={indent}>
                    <span className="text-black dark:text-white">{key}:</span>{" "}
                    <span className="text-amber-700 dark:text-amber-300">
                      '{String(value)}',
                    </span>
                  </div>
                );
              })}

              <div>
                <span className="text-gray-600 dark:text-gray-400">{"};"}</span>
              </div>
            </code>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
