import React, { useState } from "react";
import { useCurrentUser } from "@/hooks/index";

export default function PostEditor() {
  const [user] = useCurrentUser();

  const [msg, setMsg] = useState(null);

  if (!user) {
    return (
      <div>
        <h1>Please sign in to post</h1>
      </div>
    );
  }

  async function hanldeSubmit(e) {
    e.preventDefault();
    const body = {
      content: e.currentTarget.content.value,
    };
    if (!e.currentTarget.content.value) return;
    e.currentTarget.content.value = "";
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      setMsg("Posted!");
      setTimeout(() => setMsg(null), 5000);
    }
  }

  return (
    <>
      <p>{msg}</p>
      <form
        onSubmit={hanldeSubmit}
        autoComplete="off"
        className="my-6"
      >
        <label>
          <input
            className="form-input border-none ring-2 ring-gray-300 focus:ring-2 focus:ring-blue-400 py-2 px-3 mr-3 rounded-sm"
            type="text"
            name="content"
            placeholder="What is your favorite car?"
          />
        </label>
        <button
          type="submit"
          className="bg-black rounded-sm py-2 px-6 text-white font-medium"
        >
          Post
        </button>
      </form>
    </>
  );
}
