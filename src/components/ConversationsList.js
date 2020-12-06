function ConversationsList({ channels }) {
  return (
    <div className="ConversationsList">
      {channels.map((chan) => (
        <div className="ConversationsList-channel">
          {chan.id} {chan.name}
        </div>
      ))}
    </div>
  );
}

export default ConversationsList;
