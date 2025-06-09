import React from "react";

interface MessageItemProps {
  sender: string;
  content: string;
  time: string;
  category: string;
  categoryColor: string;
  isActive: boolean;
  avatar: string;
}

const MessageItem: React.FC<MessageItemProps> = ({
  sender,
  content,
  time,
  category,
  categoryColor,
  isActive,
  avatar,
}) => {
  const isHighlighted = isActive && (category === "Eleve" || category === "Parent");

  if (isHighlighted) {
    return (
      <article className="message-item highlighted">
        <img src={avatar} className="sender-avatar" alt={sender} />
        <h3 className="sender-name">{sender}</h3>
        <div className="message-content">
          <p className="message-text">{content}</p>
          <div
            className="category-badge"
            style={{ backgroundColor: categoryColor }}
          >
            {category}
          </div>
        </div>
        <span className="message-time">{time}</span>
       
      </article>
    );
  }

  return (
    <article className="message-item">
      <div className="message-container">
        <div className="message-icons">
          <div className="checkbox" />
          <img src={avatar} className="star-icon" alt="Star" />
        </div>
        <h3 className="sender-name">{sender}</h3>
        <div className="message-details">
          <div className="content-container">
            <p className="message-text">{content}</p>
            <div
              className="category-label"
              style={{
                backgroundColor:
                  category === "Administration"
                    ? "rgba(212, 86, 253, 0.1)"
                    : categoryColor,
                color:
                  category === "Administration"
                    ? "rgba(212, 86, 253, 1)"
                    : "#fff",
              }}
            >
              {category}
            </div>
          </div>
          <span className="message-time">{time}</span>
        </div>
      </div>
    </article>
  );
};

export default MessageItem; 