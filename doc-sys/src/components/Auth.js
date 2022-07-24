import React, { useState } from "react";
import { Web3Storage } from "web3.storage/dist/bundle.esm.min.js";

export default function Auth({ setClient }) {
  const [token, setToken] = useState("");

  const handleChange = (event) => {
    setToken(event.target.value);

    console.log("value is:", event.target.value);
  };

  const handleClick = async () => {
    const validation = await validateToken(token);
    // const web3storage = new Web3Storage({ token });
    // const files = [new File(["validation"], "validation.txt")];
    // const cid = await web3storage.put(files);
    // console.log("winner is:" + cid);
    console.log("validation", validation);
    if (validation) {
      const web3storage = new Web3Storage({ token: token });
      setClient(web3storage);
    } else {
      alert("wrong token");
    }
  };
  async function validateToken(token) {
    console.log("validating token", typeof token);
    const web3storage = new Web3Storage({ token });
    console.log(web3storage.list({ maxResults: 1 }));
    try {
      for await (const _ of web3storage.list({ maxResults: 1 })) {
        // any non-error response means the token is legit
        console.log("1");
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
  return (
    <div>
      <input
        type="text"
        id="token"
        onChange={handleChange}
        value={token}
        autoComplete="off"
      />
      <button onClick={handleClick}>start</button>
    </div>
  );
}
