import { css } from '@emotion/css';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import React, { useCallback, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';

import { useInterval, useUser } from '../../hooks';
import { TCommentProps } from './Comment.types';

dayjs.extend(relativeTime);

const Comment: React.FC<TCommentProps> = ({
  comment: { createdBy, createdDate, text, id },
  deleteComment,
  editComment,
}) => {
  const { username } = useUser();
  const [postedDate, setPostedDate] = useState<string>(dayjs(createdDate).fromNow());
  const isMe = username === createdBy.username;
  const isRecentIncomingComment = postedDate.includes('a few seconds ago') && !isMe;

  const updatePostedDate = useCallback(() => {
    setPostedDate(dayjs(createdDate).add(4, 'h').fromNow());
  }, [createdDate]);

  useInterval(updatePostedDate, 61_000);

  useEffect(() => {
    updatePostedDate();
  }, [createdDate, updatePostedDate]);

  return (
    <div
      className={css`
        margin: 2rem 0;
      `}
    >
      <div
        className={css`
          background: ${!isMe ? '#0001' : '#86d1db4a'};
          ${isRecentIncomingComment && 'background: #ffc0082a;'}
          border-radius: 0.15rem;
          padding: 1rem;
          border: 1px solid #bbb;
          ${isRecentIncomingComment && 'outline: 4px solid #ffc00877;'}
        `}
      >
        <span
          className={css`
            font-weight: bold;
            margin-right: 0.5rem;
          `}
        >
          {!isMe ? createdBy.name : 'Me'}:
        </span>
        <span className='text-muted'>{text}</span>
      </div>
      <div className='d-flex align-items-center'>
        <span className='p-2 text-muted opacity-50'>Posted {postedDate}</span>
        {createdBy.username === JSON.parse(localStorage.loginResponse).data.username && (
          <div className='d-flex align-items-center'>
            <Button
              onClick={() => editComment(id)}
              className='text-decoration-underline text-muted opacity-75'
              variant='link'
            >
              Edit
            </Button>
            <Button
              onClick={() => deleteComment(id)}
              className='text-decoration-underline text-danger opacity-75'
              variant='link'
            >
              Delete
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Comment;
