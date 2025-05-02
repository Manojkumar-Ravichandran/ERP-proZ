// SanitizedHTML.js
import React from 'react';
import DOMPurify from 'dompurify';

const SanitizedHTML = ({ content, allowedTags = [], allowedAttributes = {} }) => {
  const sanitizedHtml = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: allowedTags?.length ? allowedTags : undefined,
    ALLOWED_ATTR: Object.keys(allowedAttributes)?.length ? allowedAttributes : undefined,
  })

  return <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
}

export default SanitizedHTML;
