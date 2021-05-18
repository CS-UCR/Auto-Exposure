import React from "react";
import Head from "next/head";
import Link from "next/link";
import Error from "next/error";
import { all } from "@/middlewares/index";
import { useCurrentUser } from "@/hooks/index";
import Posts from "@/components/post/posts";
import { extractUser } from "@/lib/api-helpers";
import { findUserById } from "@/db/index";
import { defaultProfilePicture } from "@/lib/default";

export default function UserPage({ user }) {
  if (!user) return <Error statusCode={404} />;
  const { firstname, email, bio, profilePicture, _id } = user || {};
  const [currentUser] = useCurrentUser();
  const isCurrentUser = currentUser?._id === user._id;
  return (
    <>
      <Head>
        <title>Auto Exposure | {firstname}</title>
      </Head>
      <section className="mx-auto w-full max-w-7xl">
        <div className="flex items-center space-x-6">
          <img
            src={profilePicture || defaultProfilePicture(_id)}
            alt={firstname}
            className="rounded-full h-60 w-60"
          />
          <div>
            <div className="flex flex-col space-y-3">
              <h1 className="font-bold text-3xl tracking-loose">{firstname}</h1>
              <h2 className="font-medium text-xl text-400-xl">About</h2>
              <p>{bio}</p>
              <h2 className="font-medium text-xl text-400-xl">Email</h2>
              <p>{email}</p>
            </div>
            {isCurrentUser && (
              <Link href="/settings">
                <button
                  type="button"
                  className="bg-gray-200 rounded-sm py-2 px-6 text-black font-medium flex-intial hover:bg-gray-100
                  transition duration-200 ease-in-out"
                >
                  Edit Profile
                </button>
              </Link>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-2xl text-gray-500 text-bold my-4">My Posts</h3>
          <Posts creatorId={user._id} />
        </div>
      </section>
    </>
  );
}

export async function getServerSideProps(context) {
  await all.run(context.req, context.res);
  const user = extractUser(
    await findUserById(context.req.db, context.params.userId)
  );
  if (!user) context.res.statusCode = 404;
  return { props: { user } };
}
