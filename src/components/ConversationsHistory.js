import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  getConversationsHistory,
  getConversationsMembers,
} from "../helpers/api";
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

const extractMsgFields = ({ client_msg_id: id, ts, type, text, user }) => ({
  id,
  ts,
  type,
  user,
  text,
  hasLinks: text.match(/https?:\/\//),
  extractedLinks: extractLinks(text),
});

function ConversationsHistory({ token, setError }) {
  const [messages, setMessages] = useState(null);
  const [members, setMembers] = useState([]);
  const [histCursor, setHistCursor] = useState("");
  const [hideNoLinks, setHideNoLinks] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const { channelId } = useParams();

  const getFilteredMessages = (messages, hideNoLinks, selectedUser) => {
    let filtered = hideNoLinks
      ? messages.filter((msg) => msg.text.match(/https?:\/\//))
      : messages;
    if (selectedUser) {
      filtered = filtered.filter((msg) => msg.user === selectedUser);
    }
    return filtered;
  };

  const getUserFilterOptions = (members, messages) =>
    members
      .reduce((c, id) => {
        const msgCount = messages
          ? messages.filter(({ user }) => user === id).length
          : 0;
        if (msgCount === 0) return c;
        return [...c, { id, msgCount }];
      }, [])
      .sort((a, b) => b.msgCount - a.msgCount);

  const filteredMessages = useMemo(
    () => getFilteredMessages(messages, hideNoLinks, selectedUser),
    [messages, hideNoLinks, selectedUser]
  );

  const userFilterOptions = useMemo(
    () => getUserFilterOptions(members, messages),
    [messages, members]
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
            setHistCursor(nextCursor);
          }
        )
        .catch(setError),
    [token, channelId, setError]
  );

  const loadMembers = useCallback(
    () =>
      getConversationsMembers(token, channelId)
        .then(
          ({ ok, error: errorMessage, members, response_metadata: meta }) => {
            if (!ok) throw new Error(errorMessage);
            setMembers(members);
          }
        )
        .catch(setError),
    [token, channelId, setError]
  );

  useEffect(() => {
    if (!token || !!messages) return;
    loadMessages();
  }, [token, channelId, messages, loadMessages]);

  useEffect(() => {
    if (!token || members.length > 0) return;
    loadMembers();
  }, [token, members, loadMembers]);

  const handleClickNext = () => loadMessages(histCursor);

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
        <label htmlFor="members">
          <select
            id="members"
            onChange={(e) => setSelectedUser(e.target.value)}
            value={selectedUser}
          >
            <option value="">&mdash;</option>
            {userFilterOptions.map(({ id, msgCount }) => (
              <option key={id} value={id}>
                {id} ({msgCount})
              </option>
            ))}
          </select>
          User
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
