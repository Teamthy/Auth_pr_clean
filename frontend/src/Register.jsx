import { useState } from "react";
import api from "./api";

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      await api.post("/auth/register", {
        firstName,
        lastName,
        username,
        email,
        password,
      });
      alert("Registration successful! You can now log in.");
    } catch (err) {
      console.error(err);
      alert("Registration failed. Try again.");
    }
  }

  return (
    <div className="flex h-[700px] w-full">
      <div className="w-full hidden md:inline-block">
        <img
          className="h-full"
          src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/register/leftSideImage.png"
          alt="leftSideImage"
        />
      </div>

      <div className="w-full flex flex-col items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="md:w-96 w-80 flex flex-col items-center justify-center"
        >
          <h2 className="text-4xl text-gray-900 font-medium">Sign up</h2>
          <p className="text-sm text-gray-500/90 mt-3">
            Create your account to get started
          </p>

          {/* First Name */}
          <div className="flex items-center w-full border border-gray-300/60 h-12 rounded-full pl-6 mt-6">
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
              className="bg-transparent text-gray-500/80 outline-none text-sm w-full h-full"
              required
            />
          </div>

          {/* Last Name */}
          <div className="flex items-center w-full border border-gray-300/60 h-12 rounded-full pl-6 mt-6">
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
              className="bg-transparent text-gray-500/80 outline-none text-sm w-full h-full"
              required
            />
          </div>

          {/* Username */}
          <div className="flex items-center w-full border border-gray-300/60 h-12 rounded-full pl-6 mt-6">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="bg-transparent text-gray-500/80 outline-none text-sm w-full h-full"
              required
            />
          </div>

          {/* Email */}
          <div className="flex items-center w-full border border-gray-300/60 h-12 rounded-full pl-6 mt-6">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="bg-transparent text-gray-500/80 outline-none text-sm w-full h-full"
              required
            />
          </div>

          {/* Password */}
          <div className="flex items-center w-full border border-gray-300/60 h-12 rounded-full pl-6 mt-6">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="bg-transparent text-gray-500/80 outline-none text-sm w-full h-full"
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="flex items-center w-full border border-gray-300/60 h-12 rounded-full pl-6 mt-6">
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              className="bg-transparent text-gray-500/80 outline-none text-sm w-full h-full"
              required
            />
          </div>

          <button
            type="submit"
            className="mt-8 w-full h-11 rounded-full text-white bg-indigo-500 hover:opacity-90 transition-opacity"
          >
            Register
          </button>
          <p className="text-gray-500/90 text-sm mt-4">
            Already have an account?{" "}
            <a className="text-indigo-400 hover:underline" href="/login">
              Sign in
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
