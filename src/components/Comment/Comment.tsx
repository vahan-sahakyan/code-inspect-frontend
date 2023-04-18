import { css } from '@emotion/css';
import React from 'react';
import { Button } from 'react-bootstrap';

import { TComment } from '../../pages/AssignmentView/AssignmentView';
type TCommentProps = {
  comment: TComment;
};
const Comment: React.FC<TCommentProps> = ({ comment: { createdBy, createdDate, text } }) => {
  const date = new Date(createdDate);

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  console.log({ year, month, day });

  return (
    <div
      className={css`
        margin: 1rem 0;
      `}
    >
      <div
        className={css`
          background: #0000000a;
          /* border-radius: 0.25rem; */
          padding: 1rem;
        `}
      >
        {/* <span></span> */}
        <div
          className={css`
            /* color: var(--bs-black); */
            font-weight: bold;
          `}
        >
          {createdBy.name}
        </div>
        <span className='text-muted'>{text}</span>
      </div>
      <div className='d-flex align-items-center'>
        <Button className='text-decoration-underline text-muted opacity-75' variant='link'>
          Edit
        </Button>
        <Button className='text-decoration-underline text-danger opacity-75' variant='link'>
          Delete
        </Button>
        <span className='px-3 text-muted'>
          {day}/{month}/{year} at {hour}:{minute}
        </span>
      </div>
    </div>
  );
};

export default Comment;
