import React from 'react';
import { truncateText, formatDate } from '../../utils/helpers.js';
import { APP_CONFIG } from '../../config/constants.js';

const MailCard = React.memo(({ envelope, onClick }) => {
  return (
    <div 
      className="border-bottom border-white text-start p-2 cursor-pointer" 
      style={{ cursor: 'pointer' }}
      onClick={onClick}
      onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
      onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
    >
      <div className="d-flex w-100 justify-content-between align-items-start">
        <div className="flex-grow-1">
          <p className="mb-1 fw-bold">{truncateText(envelope.sender, 30)}</p>
          <p className="mb-1">{truncateText(envelope.subject, APP_CONFIG.UI.MAX_SUBJECT_DISPLAY_LENGTH)}</p>
          {envelope.has_attachments && (
            <small className="text-info">📎 Has attachments</small>
          )}
        </div>
        <small className="text-muted ms-2">{formatDate(envelope.date)}</small>
      </div>
    </div>
  );
});

MailCard.displayName = 'MailCard';

export default MailCard;