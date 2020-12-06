import axios from "axios";
import { apiUrl } from "../settings";

export const getAccessToken = (code) =>
  axios
    .get(`${apiUrl}/auth/token?code=${code}`)
    .then((res) => res.data)
    .then(({ access_token: token, authed_user: user }) => ({
      token,
      userId: user.id,
    }));
