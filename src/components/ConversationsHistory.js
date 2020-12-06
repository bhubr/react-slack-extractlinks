import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getConversationsHistory } from "../helpers/api";
// import "./ConversationsHistory.css";

function ConversationsHistory({ token, setError }) {
  const [messages, setMessages] = useState(null);
  const [cursor, setCursor] = useState("");
  const { channelId } = useParams();

  const loadMessages = (cur = "") =>
    getConversationsHistory(token, channelId, cur)
      .then(
        ({ ok, error: errorMessage, messages, response_metadata: meta }) => {
          if (!ok) throw new Error(errorMessage);
          const { next_cursor: nextCursor } = meta;
          setMessages(messages);
          setCursor(nextCursor);
        }
      )
      .catch(setError);

  useEffect(() => {
    if (!token || !!messages) return;
    loadMessages();
  }, [token, channelId]);

  const handleClickNext = () => loadMessages(cursor);

  if (!messages) {
    return <p>loading...</p>;
  }

  return <div className="ConversationsHistory"></div>;
}

export default ConversationsHistory;
