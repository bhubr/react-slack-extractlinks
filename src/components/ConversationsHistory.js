import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import classNames from "classnames";
import Markdown from "react-markdown";
import { getConversationsHistory } from "../helpers/api";
import "./ConversationsHistory.css";

const extractLinks = (text) => {
  const allLinks = text.match(/<https?:\/\/[^>]+/g);
  return allLinks
    ? allLinks.map((link) => link.substr(1, link.length - 2))
    : null;
};

const extractMsgFields = ({ client_msg_id: id, type, text }) => ({
  id,
  type,
  text,
  hasLinks: text.match(/https?:\/\//),
  extractedLinks: extractLinks(text),
});

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
          const mappedMessages = messages
            // .filter((msg) => msg.text.match(/https?:\/\//))
            .map(extractMsgFields);
          setMessages(mappedMessages);
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

  return (
    <div className="ConversationsHistory">
      {messages.map((msg, idx) => (
        <div
          className={classNames("ConversationsHistory-msg", {
            "ConversationsHistory-msg-dimmed": !msg.hasLinks,
          })}
          key={msg.id}
        >
          <div>
            <Markdown source={`**${idx}** ${msg.text}`} />
          </div>

          <div>
            {msg.hasLinks &&
              msg.extractedLinks.map((link) => <div key={link}>{link}</div>)}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ConversationsHistory;
