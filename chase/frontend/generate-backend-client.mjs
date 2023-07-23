import {generate} from "openapi-typescript-codegen";
import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first");

const SPEC_URL = "http://localhost:3001/documentation/json";

// rome-ignore lint/correctness/noUnusedVariables: <explanation>
const i = setInterval(async () => {
  try {
    // just check if the file is served

    await fetch(SPEC_URL);
    await generate({
      input: SPEC_URL,
      output: "backend-client",
      clientName: "API",
      useOptions: true,
    });

    clearInterval(i);
  } catch (error) {
    if (error?.cause?.code === "ECONNREFUSED") {
      // TODO: make these logs not so spammy
      console.error(
        "Fetching the openapi specs from backend failed (ECONNREFUSED). When starting the dev server, this may happen when the backend is not ready yet.",
      );
    } else {
      console.error("Could not generate client from spec: ", error);
    }

    // console.log("Retrying to generate specs...");
  }
}, 2000);
