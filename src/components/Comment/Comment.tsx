import { css } from '@emotion/css';
import React from 'react';
import { Button } from 'react-bootstrap';

import { TComment } from '../../pages/AssignmentView/AssignmentView';
type TCommentProps = {
  comment: TComment;
  deleteComment: (id: number) => void;
  editComment: (id: number) => void;
};

// prettier-ignore
export const MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

const Comment: React.FC<TCommentProps> = ({
  comment: { createdBy, createdDate, text, id },
  deleteComment,
  editComment,
}) => {
  const date = new Date(createdDate);

  const year = date.getFullYear();
  const monthLong = MONTHS_LONG[date.getMonth()];
  const monthShort = MONTHS_SHORT[date.getMonth()];
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  return (
    <div
      className={css`
        /* padding: 1rem 0; */
      `}
    >
      <div
        className={css`
          border-top: 1px solid #0002;
          border-radius: 0.25rem;
          margin: 1rem;
        `}
      >
        <span className='text-muted'>{text} - </span>
        <span
          className={css`
            font-weight: normal;
            color: var(--bs-primary);
          `}
        >
          {createdBy.name}
        </span>
        <span className='p-2 text-muted opacity-50'>
          {monthShort} {day}, {year} at {hour}:{String(minute).padStart(2, '0')}
        </span>
      </div>
      {createdBy.username === JSON.parse(localStorage.loginResponse).data.username && (
        // <div className='d-flex align-items-center'>
        <>
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
        </>
      )}
    </div>
  );
};

export default Comment;
