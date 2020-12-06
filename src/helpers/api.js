import axios from "axios";
import { apiUrl } from "../settings";

axios.defaults.baseURL = apiUrl;

export const getAccessToken = (code) =>
  axios
    .get(`/auth/token?code=${code}`)
    .then((res) => res.data)
    .then(({ token, user }) => ({
      token,
      ...user,
    }));

export const getConversationsList = async (token, cursor) => {
  const query = cursor ? `?cursor=${cursor}` : "";
  return axios
    .get(`/api/conversations.list${query}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data);
};

export const getConversationsHistory = async (token, channel, cursor) => {
  let query = `?channel=${channel}`;
  if (cursor) query += `&cursor=${cursor}`;
  return axios
    .get(`/api/conversations.history${query}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data);
};
