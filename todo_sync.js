const fs = require("fs");
const path = require("path");
const { Client } = require("@notionhq/client");
const { log } = require("console");

// Config variables
const todoLimit = 150; // This is the maximum number of TODOs that will be parsed

// RegEx for TODOs in Codespace
const regexFrontRegex =
  /(.*?)(\/\/|\/|#|\{\/\*|<!--|\/\*\*)(.*)([Tt][Oo][Dd][Oo])( ?#\d+)?( *?)(:?)/;
const idRegex = /NO-\d+/;
const regexBackRegex = /(\*\/\}|-->)(.*)/;

// Global helper variables
let todoCount = 0;
let todoWithoutIdCount = 0;
const allTodos = [];
const removedNotionTODOs = [];
let exitWithError = false;

function removeTODOIndicators(inputText) {
  let outputText;
  // Split the text after the TODO Regex
  outputText = inputText.replace(regexFrontRegex, "");
  // Remove the text after the TODO Regex
  outputText = outputText.replace(regexBackRegex, "");
  outputText = outputText.trim();
  return outputText;
}

class Todo {
  constructor(text, fullPath, line) {
    this.text = removeTODOIndicators(text);
    this.path = fullPath.split(process.cwd())[1];
    this.filename = fullPath.split(process.cwd())[1].split("/").pop();
    this.filetype = fullPath.split(".").pop();
    this.line = line;
    this.id = text.match(idRegex) ? text.match(idRegex)[0] : null;
  }

  toString() {
    return `Line ${this.line}: ${this.text}\n\t${this.path}`;
  }

  toStringShort() {
    return `Line ${this.line}: ${this.text}`;
  }

  absolutePath() {
    return path.join(process.cwd(), this.path);
  }

  addIdInFile() {
    // Read the file
    const data = fs.readFileSync(this.absolutePath(), "utf8");
    const lines = data.split("\n");

    // Add the ID to the line
    lines[this.line - 1] = lines[this.line - 1].replace(
      regexFrontRegex,
      `$1$2$3$4 ${this.id}$6$7`
    );

    // Write the file
    fs.writeFileSync(this.absolutePath(), lines.join("\n"), "utf8");

    console.info(`Added ID to ${this.toString()}`);
  }
}

function parseTodos(filePath) {
  const data = fs.readFileSync(filePath, "utf8");
  const lines = data.split("\n");

  for (let i = 0; i < lines.length; i++) {
    // Check for TODO in different comment styles
    if (lines[i].includes("TODO")) {
      const todo = new Todo(lines[i], filePath, i + 1);
      todoCount++;
      allTodos.push(todo);
    }
  }
}

function parseTodosInDirectory(directoryPath) {
  const files = fs.readdirSync(directoryPath);
  for (const file of files) {
    const fullPath = path.join(directoryPath, file);
    const stats = fs.statSync(fullPath);

    if (todoCount === todoLimit) {
      break;
    }

    // Check if the path is a file or a directory
    if (stats.isFile()) {
      // Check if the file is inside a blacklisted directory
      if (
        fullPath.includes("node_modules") ||
        fullPath.includes(".git") ||
        fullPath.includes(".idea") ||
        fullPath.includes(".vscode") ||
        fullPath.includes("dist") ||
        fullPath.includes("build") ||
        fullPath.includes("coverage") ||
        fullPath.includes("bundle") ||
        fullPath.includes("vendor") ||
        fullPath.includes("bower_components") ||
        fullPath.includes("jspm_packages") ||
        fullPath.includes("elm-stuff") ||
        fullPath.includes("flow-typed") ||
        fullPath.includes("elm-stuff") ||
        fullPath.includes("postgres-data") ||
        fullPath.includes(".next") ||
        fullPath.includes("todo_sync")
      ) {
        continue;
      }
      parseTodos(fullPath);
    } else if (stats.isDirectory()) {
      parseTodosInDirectory(fullPath);
    }
  }
}

function logTodos() {
  let countInFile = 0;
  let lastFile = "";

  console.info("TODOs found:");

  for (const todo of allTodos) {
    if (lastFile !== todo.path) {
      countInFile = 0;
    }
    if (countInFile === 0) {
      console.info(`\n${todo.path}`);
    }
    lastFile = todo.path;
    countInFile++;
    console.info(`  - ${todo.toStringShort()}`);

    if (!todo.id) {
      todoWithoutIdCount++;
    }
  }
  console.info(`\nFound ${todoCount} TODOs`);
  console.info(`Found ${todoWithoutIdCount} TODOs without IDs`);
}

async function sendTodosToNotion() {
  // Load environment variables from .env file
  require("dotenv").config();

  // Now, you can access the values using process.env
  const notion = new Client({ auth: process.env.NOTION_AUTH });
  const databaseId = process.env.DATABASE_ID;

  for (const todo of allTodos) {
    if (!todo.id) {
      const createNewPagesResponse = await notion.pages.create({
        parent: { database_id: databaseId },
        properties: {
          title: {
            title: [
              {
                text: {
                  content: todo.text,
                },
              },
            ],
          },
          path: {
            rich_text: [
              {
                text: {
                  content: todo.path,
                },
              },
            ],
          },
          filename: {
            rich_text: [
              {
                text: {
                  content: todo.filename,
                },
              },
            ],
          },
          filetype: {
            select: {
              name: todo.filetype,
            },
          },
          line: {
            number: todo.line,
          },
        },
      });

      const getIdResponse = await notion.pages.retrieve({
        page_id: createNewPagesResponse.id,
      });

      todo.id = `NO-${getIdResponse.properties.ID.unique_id.number}`;

      console.info(
        `Created new page with ID ${todo.id} and title: ${todo.text}`
      );
      todo.addIdInFile();
      setTimeout(() => {}, 300);
    }
  }

  console.info("\n\n----------------------------");
  console.info("Done sending TODOs to Notion");
  console.info("----------------------------\n\n");

  console.info("checking for Notion TODOs that are not in the codebase");

  const notionTodos = await notion.databases.query({
    database_id: databaseId,
  });

  
  for (const notionTodo of notionTodos.results) {
    const id = `NO-${notionTodo.properties.ID.unique_id.number}`;
    const name = notionTodo.properties.title.title[0].text.content;
    const status = notionTodo.properties.status.status.name;

    const found = allTodos.find((t) => t.id === id);

    if (!found && status !== "Removed") {
      console.info("\nFound TODO in Notion that is not in the codebase:");
      console.info(name);
      console.info("Adding attribute 'Removed' to Notion");
      await notion.pages.update({
        page_id: notionTodo.id,
        properties: {
          status: {
            status: {
              name: "Removed",
            },
          },
        },
      });
      setTimeout(() => {}, 300);
    }
  }

  console.info("\n\n----------------------------");
  console.info(
    "Done checking for Notion TODOs that are not in the codebase. All are set to 'Removed' to Notion"
  );
  console.info("----------------------------\n\n");

  console.info(
    "checking for TODOs with ID in the codebase that are not in Notion"
  );

  for (const todo of allTodos) {
    if (todo.id) {
      const found = notionTodos.results.find(
        (t) => `NO-${t.properties.ID.unique_id.number}` === todo.id
      );

      if (!found) {
        console.warn("\nFound TODO in codebase that is not in Notion:");
        console.warn(todo.toString());
        exitWithError = true;
      }
    }
  }

  if (exitWithError) {
    console.error("\n\n----------------------------");
    console.error(
      "Done checking for TODOs with ID in the codebase that are not in Notion. Found some!"
    );
    console.error("Please remove the TODOs from the codebase or remove the ID from the TODOs");
    console.error("----------------------------\n\n");
    process.exit(1);
  } else {
    console.info("\n\n----------------------------");
    console.info(
      "Done checking for TODOs with ID in the codebase that are not in Notion. Found none!"
    );
    console.info("----------------------------\n\n");
  }
}


console.info("Starting TODO sync");

console.info("\n\n-------------------------");
console.info("Parsing TODOs in codebase");
console.info("-------------------------\n\n");

parseTodosInDirectory(process.cwd());
logTodos();

console.info("Parsing TODOs in codebase done");

sendTodosToNotion();
