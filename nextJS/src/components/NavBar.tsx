import Link from "next/link";

import AccountMenu from "@/components/AccountMenu";
import ChangeTheme from "@/components/ChangeTheme";

// import { CgMenuGridR } from "react-icons/cg";

interface MenuItem {
  key: string;
  name: string;
  href: string;
}

interface NavbarProps {
  //   menuList: Array<{
  //     key: string;
  //     name: string;
  //     href: string;
  //   }>;
  menuList?: MenuItem[];
  className?: string;
}

function Navbar({ menuList, className }: NavbarProps) {
  return (
    <nav className={`bg-transparent ${className}`}>
      <div className="flex w-full items-center justify-between py-5">
        <div className="flex flex-shrink-0 items-center">
          <Link href="/" className=" text-[#16f2b3] text-3xl font-bold">
            MayFe
          </Link>
        </div>
        <ChangeTheme className="md:hidden" />
        <AccountMenu className="md:hidden" />

        <ul
          className="z- max-md:hidden mt-4 flex h-screen max-h-0 w-full flex-col items-start text-sm opacity-0 md:mt-0 md:h-auto md:max-h-screen md:w-auto md:flex-row md:space-x-1 md:border-0 md:opacity-100"
          id="navbar-default"
        >
          {menuList &&
            menuList.map((menu) => {
              return (
                <li key={menu.key}>
                  <Link
                    href={menu.href}
                    className="block px-4 py-2 no-underline outline-none hover:no-underline"
                  >
                    <div className="text-sm dark:text-white text-black transition-colors duration-300 hover:text-[#16f2b3]">
                      {menu.name}
                    </div>
                  </Link>
                </li>
              );
            })}
          <ChangeTheme className="flex justify-center items-center px-4" />
          <AccountMenu className="flex justify-center items-center px-4" />
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
