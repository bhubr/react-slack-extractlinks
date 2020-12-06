import { useState } from "react";
import OAuth2Login from "react-simple-oauth2-login";
import { getAccessToken } from "./helpers/api";
import {
  getStoredAuth,
  setStoredAuth,
  resetStoredAuth,
} from "./helpers/storage";
import "./App.css";
import { authorizationUrl, clientId, scopes, redirectUri } from "./settings";

function App() {
  const [auth, setAuth] = useState(getStoredAuth());
  const [error, setError] = useState(null);

  const onSuccess = ({ code }) =>
    getAccessToken(code).then((authData) => {
      setAuth(authData);
      setStoredAuth(authData);
    });

  const signout = () => {
    setAuth(null);
    resetStoredAuth();
  };

  if (!auth)
    return (
      <div className="App container">
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

  return (
    <div className="App container">
      <nav>
        {auth.token} {auth.userId}
        <button type="button" onClick={signout}>
          Sign out
        </button>
      </nav>
    </div>
  );
}

export default App;
