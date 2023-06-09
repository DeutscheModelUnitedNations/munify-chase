import React, { useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

export default function UsernameLogin({ changeLoginState }) {
  const [username, setUsername] = useState("");

  function advance() {
    // TODO request username from backend and store data in context
    // TODO if username is not found, show toast

    // navigate to the next stage of the login process (password)
    changeLoginState(1);
  }

  return (
    <div className="flex flex-col">
      <span className="p-float-label mb-5">
        <InputText
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="username">Username</label>
      </span>
      <Button
        label="Weiter"
        icon="pi pi-arrow-right"
        iconPos="right"
        onClick={advance}
        disabled={username === ""}
      />
    </div>
  );
}
