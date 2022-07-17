import React, { useState } from "react";
import { Web3Storage } from "web3.storage";

export default function Auth() {
  const [token, setToken] = useState("");

  const handleChange = (event) => {
    setToken(event.target.value);

    console.log("value is:", event.target.value);
  };

  const handleClick = async () => {
    // const validation = await validateToken(token);
    const web3storage = new Web3Storage({ token });
    const files = [new File(["validation"], "validation.txt")];
    const cid = await web3storage.put(files);
    console.log("winner is:" + cid);
  };
  async function validateToken(token1) {
    console.log("validating token", typeof token1);
    const web3storage = new Web3Storage({ token: `${token1}` });
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
