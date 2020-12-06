import { useState } from "react";
import { Link } from "react-router-dom";
import "./ConversationsList.css";

function ConversationsList({ channels, onClickNext }) {
  const [filter, setFilter] = useState("");
  const content = channels
    ? channels
        .filter((chan) => !filter || chan.name.includes(filter))
        .map((chan) => (
          <div className="ConversationsList-channel" key={chan.id}>
            <Link to={`/${chan.id}`}>{chan.name}</Link>
          </div>
        ))
    : "loading";
  const matches = Array.isArray(content)
    ? `Showing ${content.length} / ${channels.length}`
    : "N/A";
  const handleChangeFilter = ({ target }) => setFilter(target.value);

  return (
    <div className="ConversationsList">
      <div className="ConversationsList-filter">
        <label>
          Filter
          <input value={filter} onChange={handleChangeFilter} />
        </label>
        <div className="ConversationsList-filter-inner">
          <span>{matches}</span>
          <button type="button" onClick={onClickNext}>
            Next
          </button>
        </div>
      </div>
      {content}
    </div>
  );
}

export default ConversationsList;
