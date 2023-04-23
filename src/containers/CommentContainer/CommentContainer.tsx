import { Button, Col } from 'react-bootstrap';

import { Comment } from '../../components';
import useComment from '../../hooks/useComment';
import { styled } from './CommentContainer.styles';

export default function CommentContainer() {
  const {
    comment,
    setComment,
    comments,
    editingComment,
    handleSubmitComment,
    handleDeleteComment,
    handleEditComment,
    textareaRef,
  } = useComment();
  return (
    <Col sm='12' md='10' lg='8' className='pe-lg-2 pe-md-1 pe-sm-0 mt-5'>
      <textarea
        ref={textareaRef}
        className={styled.textArea}
        value={comment}
        onChange={e => setComment(e.target.value)}
      />
      <div className='d-flex justify-content-end'>
        <Button variant='dark' onClick={() => handleSubmitComment(editingComment)}>
          {!editingComment ? 'Post Comment' : 'Update Comment'}
        </Button>
      </div>
      <div className='comments-container mt-4'>
        {comments.map(comment => (
          <Comment
            deleteComment={handleDeleteComment}
            editComment={handleEditComment}
            comment={comment}
            key={comment.id}
          />
        ))}
      </div>
    </Col>
  );
}
