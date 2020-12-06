const axios = require("axios");

const slack = axios.create({
  baseURL: "https://slack.com/api",
});

const getConversationsList = async (token, cursor = "") => {
  let query = "?limit=200";
  if (cursor) query += `&cursor=${cursor}`;
  const url = `/conversations.list${query}`;
  return slack
    .get(url, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data);
};

module.exports = {
  getConversationsList,
};
