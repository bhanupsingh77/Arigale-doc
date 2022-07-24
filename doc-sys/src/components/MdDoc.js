import React, { useState } from "react";
import MDEditor from "@uiw/react-md-editor";

export default function MdDoc({
  client,
  setRenderMdDoc,
  retrivedFileName,
  retrivedValue,
}) {
  const [fileNameChange, setFileNameChange] = useState(false);

  const [fileName, setFileName] = useState(
    retrivedFileName ? retrivedFileName : ""
  );
  const [value, setValue] = useState(
    retrivedValue ? retrivedValue : "**Hello world!!!**"
  );

  const handleClick = (fileName) => {
    console.log(typeof value);
    const file = makeFileObjects(value, fileName);
    const cid = storeFiles(file, client, fileName);
    console.log(cid);
  };

  //   const handle2 = async () => {
  //     const cid = "bafybeihmibo4ia25muugh5u5vsuh34mnl4x3movu7z6zuabahvaphzclcy";
  //     const res = await retrieve(cid, client);
  //     console.log("rs", typeof res, res);
  //     setValue(res);
  //   };

  const makeFileObjects = (data, fileName) => {
    // You can create File objects from a Blob of binary data
    // see: https://developer.mozilla.org/en-US/docs/Web/API/Blob
    // Here we're just storing a JSON object, but you can store images,
    // audio, or whatever you want!
    // const blob = new Blob([JSON.stringify(obj)], { type: "application/json" });

    const files = [new File([data], `ArigaleDoc_${fileName}`)];
    return files;
  };

  async function storeFiles(files, client, fileName) {
    const cid = await client.put(files, { name: `ArigaleDoc:${fileName}.md` });
    console.log("stored files with cid:", cid);
    return cid;
  }

  //   async function retrieve(cid, client) {
  //     const res = await client.get(cid);
  //     console.log(`Got a response! [${res.status}] ${res.statusText}`);
  //     if (!res.ok) {
  //       throw new Error(`failed to get ${cid}`);
  //     }
  //     const files = await res.files();
  //     let text = "";
  //     for (const file of files) {
  //       console.log(`${file.cid} -- ${file.path} -- ${file.size}`);
  //       text = await file.text();
  //       console.log("real", text);
  //     }
  //     console.log("text", typeof text);
  //     return text;
  //     // request succeeded! do something with the response object here...
  //   }

  return (
    <div>
      <div>
        <button onClick={() => setRenderMdDoc(false)}>back</button>
      </div>
      {!fileNameChange ? (
        <div>
          <p>{fileName}</p>
          <button onClick={() => setFileNameChange(true)}>Edit</button>
          <button onClick={() => handleClick(fileName)}>save</button>
          {/* <button onClick={handle2}>retrieve</button> */}
        </div>
      ) : (
        <div>
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
          />
          <button onClick={() => setFileNameChange(false)}>save Name</button>
        </div>
      )}
      <div>
        <MDEditor height={600} value={value} onChange={setValue} />
      </div>
    </div>
  );
}
