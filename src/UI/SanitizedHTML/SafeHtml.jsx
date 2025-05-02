import React from 'react';
import DOMPurify from 'dompurify';

const TestSafeHtml = ({content}) => {
//   const unsafeContent = `<p>This is safe content.</p><script>alert('XSS')</script>`;

  const sanitizedHtml = DOMPurify.sanitize(content);

  return (
    <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
  )
}

export default TestSafeHtml;
