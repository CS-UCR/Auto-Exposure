import Layout from "../components/Layout";
import Head from "next/head";
import fetch from "isomorphic-unfetch";
import useSWR from "swr";
import Link from "next/link";
import cookie from "js-cookie";

export default function Home() {
  const { data, revalidate } = useSWR("/api/me", async function (args) {
    const res = await fetch(args);
    return res.json();
  });
  if (!data) return <h1></h1>;
  let loggedIn = false;
  if (data.email) {
    loggedIn = true;
  }
  return (
    <Layout>
      <Head>
        <title>Auto Exposure</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <section className="max-w-7xl mx-auto text-center">
        <h1 className="font-bold text-6xl my-10">Auto Exposure</h1>
        <h2 className="mb-10">Instagram but for cars.</h2>
        {loggedIn && (
          <>
            <p className="mb-2">Welcome {data.email}!</p>
            <button
              onClick={() => {
                cookie.remove("token");
                revalidate();
              }}
              className="bg-gray-200 text-black rounded-md py-1 px-3 font-medium"
            >
              Logout
            </button>
          </>
        )}
        {!loggedIn && (
          <div className="flex justify-center space-x-4">
            <Link href="/login">
              <button className="bg-gray-200 text-black rounded-md py-1 px-3 font-medium">
                Login
              </button>
            </Link>
            <Link href="/signup">
              <button className="bg-black rounded-md py-1 px-3 text-white font-medium">
                Sign Up
              </button>
            </Link>
          </div>
        )}
      </section>
    </Layout>
  );
}
