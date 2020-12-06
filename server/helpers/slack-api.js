const axios = require("axios");

const slack = axios.create({
  baseURL: "https://slack.com",
});

const getConversationsList = async (token, cursor = "") => {
  let query = "?limit=200";
  if (cursor) query += `&cursor=${cursor}`;
  const url = `/api/users.conversations${query}`;
  return slack
    .get(url, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data);
};

const getConversationsHistory = async (token, channel, cursor) => {
  let query = `?channel=${channel}`;
  if (cursor) query += `&cursor=${cursor}`;
  console.log(token, query);
  return slack
    .get(`/api/conversations.history${query}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data);
};

const getEndpoint = async (method, token) =>
  slack
    .get(`/api/${method}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data);

module.exports = {
  getConversationsList,
  getConversationsHistory,
  getEndpoint,
};
