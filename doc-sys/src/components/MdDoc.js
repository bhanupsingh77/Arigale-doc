import React from "react";
import MDEditor from "@uiw/react-md-editor";

export default function MdDoc() {
  const [value, setValue] = React.useState("**Hello world!!!**");

  return (
    <div>
      <div>
        <h1>kk</h1>
      </div>
      <div>
        <MDEditor height={600} value={value} onChange={setValue} />
      </div>
    </div>
  );
}
