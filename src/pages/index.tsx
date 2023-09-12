import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Head>
        <title>Weaviate GUI app</title>
        <meta
          name="description"
          content="An app for visualizing your Weaviate DB."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#126d02] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Weaviate <span className="text-[hsl(120,100%,70%)]">GUI</span> App
          </h1>
          <div className="font-bold text-white sm:text-[5rem]">
            <h3 className="my-2 text-center text-lg tracking-normal">
              Our app helps you visualize your data, and assist with importing
              data as well.{" "}
            </h3>
            <h3 className="text-center text-sm tracking-normal">
              *Not officially associated with Weaviate
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              href="/import"
            >
              <h3 className="text-2xl font-bold">Get Started</h3>
              <div className="text-lg">
                Start importing your data into Weaviate, with the help of our
                GUI.
              </div>
            </Link>
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              href="https://create.t3.gg/en/usage/first-steps"
              target="_blank"
            >
              <h3 className="text-2xl font-bold">Want to contribute?</h3>
              <div className="text-lg">Check out our github repo.</div>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
