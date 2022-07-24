import React, { useEffect, useState } from "react";
import MdDoc from "./MdDoc";

export default function Dashboard({ client }) {
  const [renderMdDoc, setRenderMdDoc] = useState(false);
  const [dataArray, setDataArray] = useState([]);
  const [mdDocFileRetrivedData, setMdDocFileRetrivedData] = useState({
    fileName: null,
    value: null,
  });
  // Load all saved files of user
  useEffect(() => {
    if (renderMdDoc === false) {
      console.log("vxjwwwwwwwww  ww w  w w w w w  w w  w xnwx nnxwn.///////");
      allDocuments();
    }
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
    console.log(cid);
    const res = await fileRetrieve(cid, client);
    setMdDocFileRetrivedData({
      fileName: res.name,
      value: res.mdText,
    });
    setRenderMdDoc(true);
    console.log("rs", typeof res, res);
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
        console.log(`${file.cid} -- ${file.path} -- ${file.size}`);
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
      console.log(
        `${upload.name} - cid: ${upload.cid} - size: ${upload.dagSize}`
      );

      if (`${upload.name}`.includes("ArigaleDoc")) {
        filesData.push({ name: upload.name, cid: upload.cid });
      }
    }
    setDataArray(filesData);
  };

  return renderMdDoc ? (
    <MdDoc
      setRenderMdDoc={setRenderMdDoc}
      client={client}
      retrivedFileName={mdDocFileRetrivedData.fileName}
      retrivedValue={mdDocFileRetrivedData.value}
    />
  ) : (
    <div>
      <div>
        <button onClick={handleRenderMdDoc}>New MD DOC</button>
      </div>
      <div>
        {dataArray.map((e, i) => {
          return (
            <div key={i}>
              <button onClick={() => handleMdDocFileRetrive(e.cid)}>
                {e.name.replace("ArigaleDoc:", "")}
              </button>
              <p>{e.cid}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
