import { useState, useEffect } from "react";
import OAuth2Login from "react-simple-oauth2-login";
import { Switch, Route } from "react-router-dom";
import ConversationsList from "./components/ConversationsList";
import ConversationsHistory from "./components/ConversationsHistory";
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
      .then(
        ({ ok, error: errorMessage, channels, response_metadata: meta }) => {
          if (!ok) throw new Error(errorMessage);
          const { next_cursor: nextCursor } = meta;
          setConversations(channels);
          setCursor(nextCursor);
        }
      )
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
        <img className="App-nav-avatar" src={auth.avatar} alt={auth.name} />
        <button type="button" className="App-nav-btn" onClick={signout}>
          Sign out
        </button>
      </nav>

      <div className="App-inner">
        <ConversationsList
          channels={conversations}
          onClickNext={handleClickNext}
        />

        <main className="App-main">
          {error && <div className="App-error">{error.message}</div>}

          <Switch>
            <Route
              exact
              path="/"
              render={() => <p className="App-idle">Choose a channel</p>}
            />
            <Route
              path="/:channelId"
              render={(props) => (
                <ConversationsHistory
                  {...props}
                  token={auth.token}
                  setError={setError}
                />
              )}
            />
          </Switch>
        </main>
      </div>
    </div>
  );
}

export default App;
