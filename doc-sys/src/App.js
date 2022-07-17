import React, { useState } from "react";
import MdDoc from "./components/MdDoc";
function App() {
  const [client, setClient] = useState(null);
  return (
    <div>
      <MdDoc />
    </div>
  );
}

export default App;
