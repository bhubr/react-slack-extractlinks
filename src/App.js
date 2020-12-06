import { useState, useEffect } from "react";
import OAuth2Login from "react-simple-oauth2-login";
import ConversationsList from "./components/ConversationsList";
import { getAccessToken, getConversationsList } from "./helpers/api";
import {
  getStoredAuth,
  setStoredAuth,
  resetStoredAuth,
} from "./helpers/storage";
import { authorizationUrl, clientId, scopes, redirectUri } from "./settings";
import "./App.css";

function App() {
  const [auth, setAuth] = useState(getStoredAuth());
  const [error, setError] = useState(null);
  const [conversations, setConversations] = useState(null);
  const [cursor, setCursor] = useState("");

  const onSuccess = ({ code }) =>
    getAccessToken(code).then((authData) => {
      setAuth(authData);
      setStoredAuth(authData);
    });

  const signout = () => {
    setAuth(null);
    resetStoredAuth();
  };

  const loadConversations = (cur = "") =>
    getConversationsList(auth.token, cur)
      .then(({ channels, response_metadata: meta }) => {
        const { next_cursor: nextCursor } = meta;
        setConversations(channels);
        setCursor(nextCursor);
      })
      .catch(setError);

  useEffect(() => {
    if (!auth || !!conversations) return;
    loadConversations();
  }, [auth, conversations]);

  const handleClickNext = () => loadConversations(cursor);

  if (!auth)
    return (
      <div className="App">
        <nav className="App-nav">
          <span className="App-nav-title">Slack GetLinks</span>
          <OAuth2Login
            authorizationUrl={authorizationUrl}
            responseType="code"
            clientId={clientId}
            redirectUri={redirectUri}
            scope={scopes}
            onSuccess={onSuccess}
            onFailure={setError}
            className="App-nav-btn"
          />
        </nav>
      </div>
    );

  return (
    <div className="App">
      <nav className="App-nav">
        <span className="App-nav-title">Slack GetLinks</span>
        {auth.userId}
        <button type="button" className="App-nav-btn" onClick={signout}>
          Sign out
        </button>
      </nav>
      {error && <div className="App-error">{error.message}</div>}

      <div className="App-inner">
        <ConversationsList
          channels={conversations}
          onClickNext={handleClickNext}
        />
      </div>
    </div>
  );
}

export default App;
