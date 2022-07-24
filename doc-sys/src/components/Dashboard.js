import React, { useEffect, useState } from "react";
import MdDoc from "./MdDoc";

export default function Dashboard({ client }) {
  const [loading, setLoading] = useState(false);
  const [renderMdDoc, setRenderMdDoc] = useState(false);
  const [dataArray, setDataArray] = useState([]);
  const [mdDocFileRetrivedData, setMdDocFileRetrivedData] = useState({
    fileName: null,
    value: null,
  });
  // Load all saved files of user
  useEffect(() => {
    setLoading(true);
    if (renderMdDoc === false) {
      allDocuments();
    }
    setLoading(false);
  }, [renderMdDoc]);

  const handleRenderMdDoc = () => {
    //default values
    setMdDocFileRetrivedData({
      fileName: null,
      value: null,
    });
    setRenderMdDoc(true);
  };

  const handleMdDocFileRetrive = async (cid) => {
    setLoading(true);

    const res = await fileRetrieve(cid, client);
    setMdDocFileRetrivedData({
      fileName: res.name,
      value: res.mdText,
    });
    setRenderMdDoc(true);
    setLoading(false);
  };

  const fileRetrieve = async (cid, client) => {
    const res = await client.get(cid);
    console.log(`Got a response! [${res.status}] ${res.statusText}`);
    if (!res.ok) {
      throw new Error(`failed to get ${cid}`);
    }

    let fileData = { name: null, mdText: null };
    try {
      const files = await res.files();
      for await (const file of files) {
        fileData.name = file.name;
        fileData.mdText = await file.text();
      }
    } catch (e) {
      console.log("error", e);
    }

    return fileData;
  };

  const allDocuments = async () => {
    let filesData = [];
    for await (const upload of client.list()) {
      if (`${upload.name}`.includes("ArigaleDoc")) {
        filesData.push({ name: upload.name, cid: upload.cid });
      }
    }
    setDataArray(filesData);
  };

  return loading ? (
    <div className="h-screen w-screen flex justify-center items-center">
      <div
        style={{ borderTopColor: "transparent" }}
        className="w-14 h-14 border-4 border-sky-400 border-solid rounded-full animate-spin"
      ></div>
    </div>
  ) : renderMdDoc ? (
    <MdDoc
      setRenderMdDoc={setRenderMdDoc}
      client={client}
      retrivedFileName={mdDocFileRetrivedData.fileName}
      retrivedValue={mdDocFileRetrivedData.value}
    />
  ) : (
    <div>
      <div>
        <p className="mt-2 mb-8 text-4xl text-sky-500 tracking-widest font-bold flex justify-center drop-shadow-md rounded">
          ARIGALE
        </p>
      </div>

      <div className="ml-8 font-medium flex items-center justify-center">
        <p>Create New Md Doc:</p>
        <button
          className="ml-4 m-2 p-2 text-xl text-white bg-cyan-500 hover:bg-cyan-600 rounded cursor-pointer drop-shadow-md"
          onClick={handleRenderMdDoc}
        >
          MD DOC
        </button>
      </div>
      <div>
        <p className="mt-12  px-12 text-2xl font-bold text-center text-indigo-500">
          SAVED DOCUMENTS
        </p>
        <div className="mt-12  mx-12 p-2 flex flex-wrap border-2 border-slate-300 rounded drop-shadow-md">
          {loading ? (
            <div className="w-full flex justify-center items-center">
              <div
                style={{ borderTopColor: "transparent" }}
                className="w-8 h-8 border-4 border-sky-400 border-solid rounded-full animate-spin"
              ></div>
            </div>
          ) : (
            dataArray.map((e, i) => {
              return (
                <div key={i}>
                  <button
                    className="m-4 px-12 py-2 text-lg font-medium border-4 border-slate-100 bg-blue-200 hover:bg-blue-100"
                    onClick={() => handleMdDocFileRetrive(e.cid)}
                  >
                    {e.name.replace("ArigaleDoc:", "")}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
