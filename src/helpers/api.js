import axios from "axios";
import { apiUrl } from "../settings";

axios.defaults.baseURL = apiUrl;

export const getAccessToken = (code) =>
  axios
    .get(`/auth/token?code=${code}`)
    .then((res) => res.data)
    .then(({ access_token: token, authed_user: user }) => ({
      token,
      userId: user.id,
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
