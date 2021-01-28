import React from 'react';

export default ({comments}) => {

  const renderedComments = comments.map(comment => {
    console.log(comment.status)
    let content;
    switch (comment.status) {
      case 'approved':
        content = comment.content;
        break;
      case 'pending':
        content = 'Comment is pending moderation';
        break;
      case 'rejected':
        content = 'Comment was rejected';
        break;
      
      default:
        break;
    }

    return <li key={comment.id}>{content}</li>;
  });

  return <ul>{renderedComments}</ul>;
};
