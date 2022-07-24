import React, { useState } from "react";
import MDEditor from "@uiw/react-md-editor";

export default function MdDoc({
  client,
  setRenderMdDoc,
  retrivedFileName,
  retrivedValue,
}) {
  const [loading, setLoading] = useState(false);
  const [fileNameChange, setFileNameChange] = useState(false);
  const [fileName, setFileName] = useState(
    retrivedFileName ? retrivedFileName : "NewMdDoc.md"
  );
  const [value, setValue] = useState(
    retrivedValue ? retrivedValue : "**Hello world!!!**"
  );

  const handleClick = async (fileName) => {
    setLoading(true);
    const file = await makeFileObjects(value, fileName);
    const cid = await storeFiles(file, client, fileName);
    setLoading(false);
  };

  const makeFileObjects = (data, fileName) => {
    const files = [new File([data], `ArigaleDoc_${fileName}`)];
    return files;
  };

  async function storeFiles(files, client, fileName) {
    const cid = await client.put(files, { name: `ArigaleDoc:${fileName}.md` });
    return cid;
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
      <div className="mt-2 mb-2 flex items-center text-lg font-medium ">
        <div>
          <button
            className="ml-4 mr-20 px-2 p-1 text-xl text-white bg-cyan-500 hover:bg-cyan-600 rounded cursor-pointer drop-shadow-md"
            onClick={() => setRenderMdDoc(false)}
          >
            Back
          </button>
        </div>
        {!fileNameChange ? (
          <div className="pl-2 p-1 border rounded flex justify-evenly items-center drop-shadow-md">
            <p>{`File Name: ${fileName}`}</p>
            <button
              className="ml-4 px-2 p-1 text-xl text-white bg-cyan-500 hover:bg-cyan-600 rounded cursor-pointer drop-shadow-md"
              onClick={() => setFileNameChange(true)}
            >
              Edit
            </button>
            <button
              className="ml-4 px-2 p-1 text-xl text-white bg-cyan-500 hover:bg-cyan-600 rounded cursor-pointer drop-shadow-md"
              onClick={() => handleClick(fileName)}
            >
              Save
            </button>
          </div>
        ) : (
          <div>
            <input
              className="ml-4 m-2 px-2 p-1 text-xl text-black border-2 border-sky-300 rounded drop-shadow-md"
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
            />
            <button
              className="ml-4 m-2 px-2 p-1 text-xl text-white bg-cyan-500 hover:bg-cyan-600 rounded cursor-pointer drop-shadow-md"
              onClick={() => setFileNameChange(false)}
            >
              Save Name
            </button>
          </div>
        )}
      </div>
      <div>
        <MDEditor height={600} value={value} onChange={setValue} />
      </div>
    </div>
  );
}
