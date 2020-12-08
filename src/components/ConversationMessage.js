import classNames from "classnames";
import Markdown from "react-markdown";
import "./ConversationMessage.css";

const formatTs = (ts) => {
  const [secStr] = ts.split(".");
  const sec = Number(secStr);
  const [, month, date, , time] = new Date(sec * 1000).toString().split(" ");
  return {
    date: `${month} ${date}`,
    time: time.substr(0, 5),
  };
};

function ConversationMessage({ msg, idx }) {
  const { date, time } = formatTs(msg.ts);
  return (
    <div
      className={classNames("ConversationMessage", {
        "ConversationMessage-dimmed": !msg.hasLinks,
      })}
    >
      <div className="ConversationMessage-md">
        <span className="ConversationMessage-ts">
          <span className="ConversationMessage-ts-date">{date}</span>
          <span className="ConversationMessage-ts-time">{time}</span>
        </span>
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
