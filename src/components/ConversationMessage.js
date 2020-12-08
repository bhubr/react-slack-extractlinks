import classNames from "classnames";
import Markdown from "react-markdown";
import "./ConversationMessage.css";

const formatTs = (ts) => {
  const [secStr] = ts.split(".");
  const sec = Number(secStr);
  const [date, time] = new Date(sec * 1000).toISOString().split("T");
  return `${date} ${time.substr(0, 5)}`;
};

function ConversationMessage({ msg, idx }) {
  return (
    <div
      className={classNames("ConversationMessage", {
        "ConversationMessage-dimmed": !msg.hasLinks,
      })}
    >
      <div>
        <span className="ConversationMessage-datetime">{formatTs(msg.ts)}</span>
        <Markdown source={msg.text} />
      </div>

      <div>
        {msg.hasLinks &&
          msg.extractedLinks.map(({ href, label }) => (
            <div key={href}>
              <a target="_blank" rel="noopener noreferrer" href={href}>
                {label}
              </a>
            </div>
          ))}
      </div>
    </div>
  );
}

export default ConversationMessage;
