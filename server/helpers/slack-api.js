const axios = require("axios");

const slack = axios.create({
  baseURL: "https://slack.com/api",
});

const getConversationsList = async (token) =>
  slack
    .get("/conversations.list", {
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data);

module.exports = {
  getConversationsList,
};
