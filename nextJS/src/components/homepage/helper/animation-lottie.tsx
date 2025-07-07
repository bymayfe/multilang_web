"use client";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

interface AnimationLottieProps {
  animationPath: object; // The animation data, typically imported from a JSON file
  width?: string | number;
}

const AnimationLottie = ({ animationPath, width }: AnimationLottieProps) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationPath,
    style: {
      width: "95%",
    },
  };
  return <Lottie {...defaultOptions} />;
};

export default AnimationLottie;
