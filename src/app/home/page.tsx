import HomeMain from "@/components/homepage/page";

export const metadata = {
  title: "Home Page",
  description: "Home Page Description",
};
const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const HomePage = async () => {
  // await sleep(3000);
  return (
    <>
      <HomeMain />
    </>
  );
};

export default HomePage;
