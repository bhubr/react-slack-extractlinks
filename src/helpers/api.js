import axios from "axios";
import { apiUrl } from "../settings";

const local = axios.create({
  baseURL: apiUrl,
});

const slack = axios.create({
  baseURL: "https://slack.com/api",
});

export const getAccessToken = (code) =>
  local
    .get(`/auth/token?code=${code}`)
    .then((res) => res.data)
    .then(({ access_token: token, authed_user: user }) => ({
      token,
      userId: user.id,
    }));

export const getConversationsList = (token) =>
  slack
    .get("/conversations.list", {
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data);
