import classNames from "classnames";
import Markdown from "react-markdown";
import "./ConversationMessage.css";

function ConversationMessage({ msg, idx }) {
  return (
    <div
      className={classNames("ConversationMessage", {
        "ConversationMessage-dimmed": !msg.hasLinks,
      })}
    >
      <div>
        <Markdown source={`**${idx}** ${msg.text}`} />
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
