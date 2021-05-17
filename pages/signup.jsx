import React, { useState, useEffect } from "react";
import Head from "next/head";
import Router from "next/router";
import Link from "next/link";
import { useCurrentUser } from "@/hooks/index";

const SignupPage = () => {
  const [user, { mutate }] = useCurrentUser();
  const [errorMsg, setErrorMsg] = useState("");
  useEffect(() => {
    // redirect to home if user is authenticated
    if (user) Router.replace("/");
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = {
      email: e.currentTarget.email.value,
      name: e.currentTarget.name.value,
      password: e.currentTarget.password.value,
    };
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.status === 201) {
      const userObj = await res.json();
      mutate(userObj);
    } else {
      setErrorMsg(await res.text());
    }
  };

  return (
    <>
      <Head>
        <title>Auto Exposure | Sign up</title>
      </Head>
      <section className="mx-auto max-w-sm">
        <h1 className="font-bold text-3xl tracking-loose mb-4">Sign Up</h1>
        <h2>Sign up to enjoy and share your cars on Auto Exposure.</h2>
        <form onSubmit={handleSubmit} className="space-y-2 min-w-full max-w-sm">
          {errorMsg ? <p className="text-red-500">{errorMsg}</p> : null}
          <div className="flex flex-col">
            <label className="font-medium">Username:</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your name"
              className="form-input border-none ring-2 ring-gray-300 focus:ring-2 focus:ring-blue-400 py-2 px-3 rounded-sm min-w-full"
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium">Email:</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              className="form-input border-none ring-2 ring-gray-300 focus:ring-2 focus:ring-blue-400 py-2 px-3 rounded-sm min-w-full"
            />
          </div>
          <div className="flex flex-col pb-4">
            <label className="font-medium">Password:</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Create a password"
              className="form-input border-none ring-2 ring-gray-300 focus:ring-2 focus:ring-blue-400 py-2 px-3 rounded-sm min-w-full"
            />
          </div>
          <div className="flex flex-col space-y-3">
            <button
              className="bg-black text-white rounded-sm py-1 px-3 font-medium"
              type="submit"
            >
              Sign up
            </button>
            <p className="text-gray-500">
              Already have an account? Sign in{" "}
              <Link href="/login">
                <a className="underline">here</a>
              </Link>
              .
            </p>
          </div>
        </form>
      </section>
    </>
  );
};

export default SignupPage;
