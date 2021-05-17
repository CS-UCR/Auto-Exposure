import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCurrentUser } from "@/hooks/index";

const LoginPage = () => {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState("");
  const [user, { mutate }] = useCurrentUser();
  useEffect(() => {
    // redirect to home if user is authenticated
    if (user) router.push("/");
  }, [user]);

  async function onSubmit(e) {
    e.preventDefault();
    const body = {
      email: e.currentTarget.email.value,
      password: e.currentTarget.password.value,
    };
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.status === 200) {
      const userObj = await res.json();
      mutate(userObj);
    } else {
      setErrorMsg("Incorrect username or password. Try again!");
    }
  }

  return (
    <>
      <Head>
        <title>Auto Exposure | Sign in</title>
      </Head>
      <section className="mx-auto max-w-sm">
        <h1 className="font-bold text-3xl tracking-loose mb-4">Sign In</h1>
        <h2>
          Log in to your account on Auto Exposure here to continue sharing and
          enjoying cars.
        </h2>
        <form onSubmit={onSubmit} className="space-y-2 min-w-full max-w-sm">
          {errorMsg ? <p className="text-red-600 my-4">{errorMsg}</p> : null}
          <div className="flex flex-col">
            <label className="font-medium">Email:</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              className="form-input border-none ring-2 ring-gray-300 focus:ring-2 focus:ring-blue-400 py-2 px-3 rounded-sm min-w-full"
            />
          </div>
          <div className="flex flex-col pb-4">
            <label className="font-medium">Password: </label>
            <input
              className="form-input border-none ring-2 ring-gray-300 focus:ring-2 focus:ring-blue-400 py-2 px-3 rounded-sm min-w-full"
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
            />
          </div>
          <div className="flex flex-col space-y-3">
            <button
              className="bg-gray-200 text-black rounded-sm py-1 px-3 font-medium"
              type="submit"
            >
              Login
            </button>
            <p className="text-gray-500">
              Don't have an account? Sign up{" "}
              <Link href="/signup">
                <a className="underline">here</a>
              </Link>
              .
            </p>
            <p className="text-gray-500">
              Did you{" "}
              <Link href="/forget-password">
                <a className="underline">forget your password?</a>
              </Link>
            </p>
          </div>
        </form>
      </section>
    </>
  );
};

export default LoginPage;
