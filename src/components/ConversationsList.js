import "./ConversationsList.css";

function ConversationsList({ channels }) {
  const content = channels
    ? channels.map((chan) => (
        <div className="ConversationsList-channel">{chan.name}</div>
      ))
    : "loading";
  return <div className="ConversationsList">{content}</div>;
}

export default ConversationsList;
