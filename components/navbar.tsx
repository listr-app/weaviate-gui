import routes from "../modules/frontend/routes";
import { classNames } from "../modules/functions/css";
import logo from "@/public/logo.svg";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

function Logo() {
  return (
    <Link
      className="flex items-center rounded-lg transition-colors"
      href={routes.home}
    >
      {/* <Image
        priority
        src={logo}
        alt="listr"
        className="rounded-lg"
        width={110}
      /> */}
      LOGO
    </Link>
  );
}

function MobileMenuButton({ open }: { open: boolean }) {
  return (
    <Disclosure.Button className="inline-flex items-center justify-center rounded-lg p-1 focus:outline-none">
      <span className="sr-only">Open main menu</span>
      {open ? (
        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
      ) : (
        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
      )}
    </Disclosure.Button>
  );
}

function MobileMenuDropdown({ navigation }: { navigation: any }) {
  return (
    <Disclosure.Panel className="sm:hidden">
      <div className="space-y-1 px-2 pb-3 pt-2">
        {navigation.map((item: any) => (
          <Disclosure.Button
            key={item.name}
            as="a"
            href={item.href}
            className={classNames(
              item.current ? "bg-orange-100  text-orange-500" : "",
              "block rounded-md px-3 py-2 text-base font-medium transition-colors hover:bg-orange-100 hover:text-orange-500",
            )}
            aria-current={item.current ? "page" : undefined}
          >
            {item.name}
          </Disclosure.Button>
        ))}
      </div>
    </Disclosure.Panel>
  );
}

export default function Navbar() {
  // const { user } = useUserStore((state) => state);
  // const { setModalState } = useModalStore((state) => state);
  const router = useRouter();

  const navigation = [
    {
      name: "File Viewer",
      href: routes.home,
      current: router.pathname === routes.home,
    },
    {
      name: "Importer",
      href: routes.listings.drafts,
      current:
        router.pathname === routes.listings.drafts ||
        router.pathname === routes.listings.published,
    },
  ];

  return (
    <div className="sticky top-0 z-10 border border-gray-100 bg-white">
      <Disclosure as="nav">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
              <div className="relative flex h-16 items-center justify-between">
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                  <MobileMenuButton open={open} />
                </div>

                <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                  <Logo />

                  <div className="hidden sm:ml-6 sm:block">
                    <div className="flex h-full items-center space-x-4">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={classNames(
                            item.current ? "bg-orange-100 text-orange-500" : "",
                            "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-orange-100 hover:text-orange-500",
                          )}
                          aria-current={item.current ? "page" : undefined}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  {/* <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                    {!user ? (
                      <Button
                        variant="dark"
                        className="p-2 px-4"
                        onClick={() =>
                          setModalState("sign-in-modal", {
                            show: true,
                          })
                        }
                      >
                        Log In
                      </Button>
                    ) : (
                      <>
                        <NotificationMenu />
                        <ProfileMenu />
                      </>
                    )}
                  </div> */}
                </div>
              </div>
            </div>

            <MobileMenuDropdown navigation={navigation} />
          </>
        )}
      </Disclosure>
    </div>
  );
}
