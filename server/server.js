const express = require("express");
const cors = require("cors");
const axios = require("axios");
const qs = require("qs");
require("dotenv").config();
const { port, oauth } = require("./settings");
const { getConversationsList } = require("./helpers/slack-api");

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.get("/auth/token", (req, res) => {
  const { code } = req.query;
  const { tokenUrl, clientId, clientSecret, redirectUri } = oauth;
  // GitHub wants everything in an url-encoded body
  const payload = qs.stringify({
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
  });
  axios
    .post(tokenUrl, payload, {
      headers: {
        "content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    })
    // GitHub sends back the response as an url-encoded string
    .then((resp) => qs.parse(resp.data))
    .then((data) => res.json(data))
    .catch((err) => {
      console.error("Error while requesting a token", err.response.data);
      res.status(500).json({
        error: err.message,
      });
    });
});

app.get("/api/conversations.list", async (req, res) => {
  const { authorization } = req.headers;
  console.log(authorization);
  if (!authorization) return res.sendStatus(401);
  const [, token] = authorization.match(/Bearer (.*)/);
  try {
    const conversations = await getConversationsList(token);
    return res.json(conversations);
  } catch (err) {
    console.error(err);
    return res.status(err.response.status).json({
      error: err.message,
    });
  }
});

app.listen(port, (err) => {
  if (err) {
    console.error("Something wrong happened", err);
  } else {
    console.log("server listening");
  }
});
