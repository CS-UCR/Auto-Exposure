import React from "react";
import { useCurrentUser } from "@/hooks/index";
import PostEditor from "@/components/post/editor";
import Posts from "@/components/post/posts";

const IndexPage = () => {
  const [user] = useCurrentUser();

  return (
    <section className="mx-auto w-full max-w-7xl">
      <h1 className="font-bold text-3xl tracking-loose">
        Strap in, {user ? user.name : "Racer"}.
      </h1>
      <div>
        <h2 className="font-medium text-xl text-gray-400 my-4">
          Here is your current feed. Enjoy the drive.
        </h2>
        <PostEditor />
        <Posts />
      </div>
    </section>
  );
};

export default IndexPage;
