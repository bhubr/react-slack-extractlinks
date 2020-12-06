import { useState } from "react";
import OAuth2Login from "react-simple-oauth2-login";
import { getAccessToken } from "./helpers/api";
import "./App.css";
import Header from "./components/Header";
import { authorizationUrl, clientId, scopes, redirectUri } from "./settings";

function App() {
  const [token, setToken] = useState("");
  const [error, setError] = useState(null);

  const onSuccess = ({ code }) => getAccessToken(code);

  return (
    <div className="App container">
      <Header />

      <OAuth2Login
        authorizationUrl={authorizationUrl}
        responseType="code"
        clientId={clientId}
        redirectUri={redirectUri}
        scope={scopes}
        onSuccess={onSuccess}
        onFailure={setError}
      />
    </div>
  );
}

export default App;
