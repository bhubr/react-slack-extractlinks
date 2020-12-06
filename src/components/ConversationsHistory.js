import { useState } from "react";
import { useParams } from "react-router-dom";
import { getConversationsHistory } from "../helpers/api";
// import "./ConversationsHistory.css";

function ConversationsHistory({ channels, onClickNext }) {
  const [messages, setMessages] = useState(null);
  const { channelId } = useParams();

  if (!messages) {
    return <p>loading...</p>;
  }

  return <div className="ConversationsHistory"></div>;
}

export default ConversationsHistory;
