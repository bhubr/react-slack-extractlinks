import { useState, useEffect } from "react";
import OAuth2Login from "react-simple-oauth2-login";
import { getAccessToken, getConversationsList } from "./helpers/api";
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
  const [conversations, setConversations] = useState(null);

  const onSuccess = ({ code }) =>
    getAccessToken(code).then((authData) => {
      setAuth(authData);
      setStoredAuth(authData);
    });

  const signout = () => {
    setAuth(null);
    resetStoredAuth();
  };

  useEffect(() => {
    if (!auth || !!conversations) return;
    console.log("fire effect");
    getConversationsList(auth.token).then(setConversations).catch(setError);
  }, [auth]);

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
      {error && <div className="App-error">{error.message}</div>}
      <nav>
        {auth.token} {auth.userId}
        <button type="button" onClick={signout}>
          Sign out
        </button>
      </nav>
      {conversations && conversations.length}
    </div>
  );
}

export default App;
