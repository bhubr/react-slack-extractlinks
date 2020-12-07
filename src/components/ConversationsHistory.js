import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import { getConversationsHistory } from "../helpers/api";
import "./ConversationsHistory.css";
import ConversationMessage from "./ConversationMessage";

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

const extractLinks = (text) => {
  const allLinks = text.match(/<https?:\/\/[^>]+/g);
  if (!allLinks) return null;
  return allLinks.map((link) => {
    const href = link.substr(1, link.length - 1);
    const regExpString = `•(.*):\\s*<(${escapeRegExp(href)})>`;
    const re = new RegExp(regExpString);
    const matches = text.match(re);
    const label = matches && matches.length === 3 ? matches[1].trim() : href;
    return { href, label };
  });
};

const extractMsgFields = ({ client_msg_id: id, ts, type, text }) => ({
  id,
  ts,
  type,
  text,
  hasLinks: text.match(/https?:\/\//),
  extractedLinks: extractLinks(text),
});

function ConversationsHistory({ token, setError }) {
  const [messages, setMessages] = useState(null);
  const [cursor, setCursor] = useState("");
  const [hideNoLinks, setHideNoLinks] = useState(false);
  const { channelId } = useParams();

  const getFilteredMessages = (messages, hideNoLinks) =>
    hideNoLinks
      ? messages.filter((msg) => msg.text.match(/https?:\/\//))
      : messages;

  const filteredMessages = useMemo(
    () => getFilteredMessages(messages, hideNoLinks),
    [messages, hideNoLinks]
  );

  const loadMessages = useCallback(
    (cur = "") =>
      getConversationsHistory(token, channelId, cur)
        .then(
          ({ ok, error: errorMessage, messages, response_metadata: meta }) => {
            if (!ok) throw new Error(errorMessage);
            const { next_cursor: nextCursor } = meta;
            const mappedMessages = messages.map(extractMsgFields);
            setMessages(mappedMessages);
            setCursor(nextCursor);
          }
        )
        .catch(setError),
    [token, channelId, setError]
  );

  useEffect(() => {
    if (!token || !!messages) return;
    loadMessages();
  }, [token, channelId, messages, loadMessages]);

  const handleClickNext = () => loadMessages(cursor);

  if (!messages) {
    return <p>loading...</p>;
  }

  return (
    <div className="ConversationsHistory">
      <div className="ConversationsHistory-filters">
        <label htmlFor="hideNoLinks">
          <input
            id="hideNoLinks"
            type="checkbox"
            checked={hideNoLinks}
            onChange={(e) => setHideNoLinks(e.target.checked)}
          />{" "}
          Only messages with links
        </label>
      </div>

      <div className="ConversationsHistory-inner">
        {filteredMessages.map((msg, idx) => (
          <ConversationMessage key={msg.id || msg.ts} msg={msg} idx={idx} />
        ))}
      </div>
    </div>
  );
}

export default ConversationsHistory;
