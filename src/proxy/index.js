import { Router } from "express";
import WebSocket from "ws";
import got from "got";
const router = Router();

/**
 * Make a request to TETR.IO.
 * @param {string} path 
 * @param {import("got").OptionsOfTextResponseBody} options 
 */
const request = async (path, options = {}) => {
  return await got(path.replace(/^\/|\/$/g, ""), {
    prefixUrl: "https://tetr.io",
    ...options
  });
};

router.get("/user-content/*", async (req, res) => {
  const path = req.path;
  
  console.info("[/proxy/user-content/*] ->", path);
  const response = await request(path);

  for (const header_key of Object.keys(response.headers)) {
    res.setHeader(header_key, response.headers[header_key]);
  } 

  res.send(response.rawBody);
});

router.get("/about/homebanner.html", async (req, res) => {
  const path = req.path;

  console.info("[/proxy/about/*] ->", path);
  const response = await request(path);

  res.setHeader("content-type", "text/html; charset=UTF-8");
  res.send(response.rawBody);
});

router.get("/about/patchnotes/notes.json", async (req, res) => {
  const path = req.path;

  console.info("[/proxy/about/*] ->", path);
  const response = await request(path);

  res.json(JSON.parse(response.body));
});

router.all("/api/*", async (req, res) => {
  const path = req.path;

  let body;
  if (req.method !== "GET") {
    body = req.body
      ? typeof req.body === "object"
        ? JSON.stringify(req.body)
        : req.body
      : undefined;
  }

  console.info("[/proxy/api/*] ->", path);
  const response = await request(path, {
    method: req.method,
    headers: {
      cookie: req.headers?.cookie,
      "content-type": req.headers?.["content-type"],
      "user-agent": req.headers?.["user-agent"],
      "authorization": req.headers?.["authorization"]
    },
    body
  });

  /** TETR.IO response from API. */
  let response_body = response.body;

  // We need to overwrite the endpoint URL
  // so it points to our proxy.
  if (path === "/api/server/ribbon") {
    const data = JSON.parse(response_body);
    if (data.success) {
      const protocol = req.protocol === "https" ? "wss" : "ws";
      const proxy_endpoint = protocol + "://" + req.get("host") + "/proxy/ws";

      data.endpoint = data.endpoint.replace("wss://tetr.io", proxy_endpoint);

      response_body = JSON.stringify(data);
    }
  }

  res.send(response_body);
});

router.use("/ws", (req) => {
  const ws_name = req.path.replaceAll("/", "");
  const ws_client = new WebSocket("wss://tetr.io/" + ws_name);

  ws_client.on("open", async () => {
    const ws_server = await req.ws();

    ws_server.on("message", (msg) => {
      console.log("[/proxy/ws] send to -> tetr.io");
      ws_client.send(msg);
    });

    ws_client.on("message", (msg) => {
      console.log("[/proxy/ws] received from <- tetr.io");
      ws_server.send(msg);
    });

    console.info("[/proxy/ws] connected to", ws_name);
  });
});

export default router;

