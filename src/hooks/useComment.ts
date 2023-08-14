import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import { TComment } from '../components/Comment/Comment.types';
import ApiService from '../services/apiService';
import useLocalState from './useLocalStorage';

export default function useComment() {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Array<TComment>>([]);
  const [editingComment, setEditingComment] = useState<TComment>();

  const params = useParams();
  const assignmentId = parseInt(params.assignmentId as string);

  const [jwt] = useLocalState<string>('', 'jwt');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const fetchComments = useCallback(
    async function () {
      try {
        const res = await ApiService.getComments(assignmentId);
        setComments(res.reverse());
      } catch (error) {
        console.warn(error);
      }
    },
    [assignmentId]
  );

  const handleSubmitComment = useCallback(
    async function (passedComment?: TComment) {
      try {
        if (passedComment) {
          const response: TComment = await ApiService.editComment({
            id: passedComment.id,
            assignmentId: assignmentId,
            text: comment,
            user: jwt,
          });

          setComments(comments.map(item => (item.id === response.id ? response : item)));
        } else {
          const response: TComment = await ApiService.postComment({
            assignmentId: assignmentId,
            text: comment,
            user: jwt,
          });

          setComments([response, ...comments]);
        }
      } finally {
        setComment('');
        setEditingComment(undefined);
      }
    },
    [assignmentId, comment, comments, jwt]
  );
  const handleDeleteComment = useCallback(
    async function (id: number) {
      try {
        await ApiService.deleteComment(id);
        setComments(comments.filter(item => item.id !== id));
      } catch (error) {
        console.error(error);
      }
    },
    [comments]
  );

  const handleEditComment = useCallback(
    async function (id: number) {
      scrollTo({ top: 0 });
      textareaRef.current?.focus();

      const idx = comments.findIndex(item => item.id === id);
      setEditingComment(comments[idx]);
      setComment(comments[idx].text);
    },
    [comments]
  );

  useEffect(() => {
    if (!assignmentId) return;
    fetchComments();
  }, [assignmentId, fetchComments]);

  return {
    comment,
    setComment,
    comments,
    setComments,
    editingComment,
    handleSubmitComment,
    handleDeleteComment,
    handleEditComment,
    textareaRef,
  };
}
