const http = require("http");
const fs = require("fs");
const path = require("path");

const port = 3000;
const frontendPath = path.join(__dirname, "index.html");

const server = http.createServer((request, response) => {
  if (request.method === "GET" && request.url === "/") {
    fs.readFile(frontendPath, (error, content) => {
      if (error) {
        response.writeHead(500, { "Content-Type": "text/plain" });
        response.end("Unable to load the frontend");
        return;
      }

      response.writeHead(200, { "Content-Type": "text/html" });
      response.end(content);
    });
    return;
  }

  if (request.method === "POST" && request.url === "/login") {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk;
    });

    request.on("end", () => {
      try {
        const { username } = JSON.parse(body);
        const cleanUsername = String(username || "").trim();

        if (!cleanUsername) {
          response.writeHead(400, { "Content-Type": "application/json" });
          response.end(JSON.stringify({ message: "Please enter a username" }));
          return;
        }

        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ message: `Welcome, ${cleanUsername}!` }));
      } catch (error) {
        response.writeHead(400, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ message: "Invalid request" }));
      }
    });
    return;
  }

  response.writeHead(404, { "Content-Type": "text/plain" });
  response.end("Not found");
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
