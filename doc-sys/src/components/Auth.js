import React, { useState } from "react";
import { Web3Storage } from "web3.storage/dist/bundle.esm.min.js";

export default function Auth({ setClient }) {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setToken(event.target.value);
  };

  const handleClick = async () => {
    setLoading(true);
    const validation = await validateToken(token);

    if (validation) {
      const web3storage = new Web3Storage({ token: token });
      setClient(web3storage);
      setLoading(false);
    } else {
      setLoading(false);
      alert("Wrong Web3.Storage Token");
    }
  };
  async function validateToken(token) {
    if (token === "") return false;
    const web3storage = new Web3Storage({ token });
    try {
      for await (const _ of web3storage.list({ maxResults: 1 })) {
        // any non-error response means the token is legit
        break;
      }
      return true;
    } catch (e) {
      // only return false for auth-related errors
      if (e.message.includes("401") || e.message.includes("403")) {
        console.log("invalid token", e.message);
        return false;
      }
      // propagate non-auth errors
      throw e;
    }
  }
  return loading ? (
    <div className="h-screen w-screen flex justify-center items-center">
      <div
        style={{ borderTopColor: "transparent" }}
        className="w-14 h-14 border-4 border-sky-400 border-solid rounded-full animate-spin"
      ></div>
    </div>
  ) : (
    <div>
      <div>
        <p className="mt-2 mb-8 text-4xl text-sky-500 tracking-widest font-bold flex justify-center drop-shadow-md rounded">
          ARIGALE
        </p>
      </div>
      <div className="mt-32 flex justify-center items-center text-xl font-medium border-2">
        <p>Web3Storage Token: </p>
        <input
          className="ml-4 m-2 px-2 p-1 text-xl text-black border-2 border-sky-300 rounded drop-shadow-md"
          type="text"
          id="token"
          onChange={handleChange}
          value={token}
          autoComplete="off"
        />
        <button
          className="px-8  text-lg font-medium border-4 border-slate-100 bg-sky-300 hover:bg-sky-200"
          onClick={handleClick}
        >
          Login
        </button>
      </div>
      <div className="mt-2 flex justify-center items-center text-md font-medium border-2">
        <p>
          How to generate an Web3Storage API token ?
          <a
            className="text-sky-500"
            target="_blank"
            href="https://web3.storage/docs/how-tos/generate-api-token/"
          >
            {` Click here`}
          </a>
        </p>
      </div>
    </div>
  );
}
