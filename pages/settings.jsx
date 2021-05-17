import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { useCurrentUser } from "@/hooks/index";

const ProfileSection = () => {
  const [user, { mutate }] = useCurrentUser();
  const [isUpdating, setIsUpdating] = useState(false);
  const nameRef = useRef();
  const bioRef = useRef();
  const profilePictureRef = useRef();
  const [msg, setMsg] = useState({ message: "", isError: false });

  useEffect(() => {
    nameRef.current.value = user.name;
    bioRef.current.value = user.bio;
  }, [user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isUpdating) return;
    setIsUpdating(true);
    const formData = new FormData();
    if (profilePictureRef.current.files[0]) {
      formData.append("profilePicture", profilePictureRef.current.files[0]);
    }
    formData.append("name", nameRef.current.value);
    formData.append("bio", bioRef.current.value);
    const res = await fetch("/api/user", {
      method: "PATCH",
      body: formData,
    });
    if (res.status === 200) {
      const userData = await res.json();
      mutate({
        user: {
          ...user,
          ...userData.user,
        },
      });
      setMsg({ message: "Profile updated" });
    } else {
      setMsg({ message: await res.text(), isError: true });
    }
    setIsUpdating(false);
  };

  const handleSubmitPasswordChange = async (e) => {
    e.preventDefault();
    const body = {
      oldPassword: e.currentTarget.oldPassword.value,
      newPassword: e.currentTarget.newPassword.value,
    };
    e.currentTarget.oldPassword.value = "";
    e.currentTarget.newPassword.value = "";

    const res = await fetch("/api/user/password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.status === 200) {
      setMsg({ message: "Password updated" });
    } else {
      setMsg({ message: await res.text(), isError: true });
    }
  };

  async function sendVerificationEmail() {
    const res = await fetch("/api/user/email/verify", {
      method: "POST",
    });
    if (res.status === 200) {
      setMsg({ message: "An email has been sent to your mailbox." });
    } else {
      setMsg({ message: await res.text(), isError: true });
    }
  }

  return (
    <>
      <Head>
        <title>Settings</title>
      </Head>
      <section className="mx-auto w-full max-w-sm">
        <h1 className="font-bold text-3xl tracking-loose mb-4">Edit Profile</h1>
        {msg.message ? (
          <p className="text-red-500 my-4">{msg.message}</p>
        ) : null}
        <form onSubmit={handleSubmit} className="space-y-2 min-w-full max-w-sm">
          {!user.emailVerified ? (
            <p>
              Your email has not been verified. <br />{" "}
              {/* eslint-disable-next-line */}
              <a
                role="button"
                className="text-blue-500 underline"
                onClick={sendVerificationEmail}
              >
                Send verification email
              </a>
            </p>
          ) : null}
          <div className="flex flex-col space-y-4">
            {/* <label htmlFor="name">
              Name
              <input
                required
                id="name"
                name="name"
                type="text"
                placeholder="Your name"
                ref={nameRef}
              />
            </label> */}
            <div className="flex flex-col">
              <label className="font-medium">Username:</label>
              <input
                disabled // Just for now
                id="name"
                name="name"
                type="text"
                placeholder="Change your name"
                ref={nameRef}
                className="form-input border-none ring-2 ring-gray-300 focus:ring-2 focus:ring-blue-400 py-2 px-3 rounded-sm min-w-full"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium">Username:</label>
              <textarea
                id="bio"
                name="bio"
                type="text"
                placeholder="Tell the world about yourself."
                ref={bioRef}
                className="form-input border-none ring-2 ring-gray-300 focus:ring-2 focus:ring-blue-400 py-2 px-3 rounded-sm min-w-full"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium">Username:</label>
              <input
                type="file"
                id="avatar"
                name="avatar"
                accept="Upload your own profile picture"
                ref={profilePictureRef}
                className="form-input border-none ring-2 ring-gray-300 focus:ring-2 focus:ring-blue-400 py-2 px-3 rounded-sm min-w-full"
              />
            </div>
            <button
              disabled={isUpdating}
              type="submit"
              className="bg-black text-white rounded-sm py-1 px-3 font-medium"
            >
              Save
            </button>
          </div>
        </form>
        <form
          onSubmit={handleSubmitPasswordChange}
          className="space-y-2 min-w-full max-w-sm mt-8"
        >
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col">
              <label className="font-medium">Old password:</label>
              <input
                type="password"
                name="oldPassword"
                id="oldpassword"
                required
                className="form-input border-none ring-2 ring-gray-300 focus:ring-2 focus:ring-blue-400 py-2 px-3 rounded-sm min-w-full"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium">New password:</label>
              <input
                type="password"
                name="newPassword"
                id="newpassword"
                required
                className="form-input border-none ring-2 ring-gray-300 focus:ring-2 focus:ring-blue-400 py-2 px-3 rounded-sm min-w-full"
              />
            </div>
            <button
              type="submit"
              className="bg-black text-white rounded-sm py-1 px-3 font-medium"
            >
              Change Password
            </button>
          </div>
        </form>
      </section>
    </>
  );
};

const SettingPage = () => {
  const [user] = useCurrentUser();

  if (!user) {
    return (
      <>
        <p>Please sign in</p>
      </>
    );
  }
  return <ProfileSection />;
};

export default SettingPage;
