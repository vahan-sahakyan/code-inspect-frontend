import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { TAssignment } from '../pages/Dashboard/Dashboard';
import ApiService, {
  TAssignmentEnum,
  TAssignmentStatusEnum,
  TAssignmentStatusValues,
  TGetAssingmentResponse,
} from '../services/apiService';
import useLocalState from './useLocalStorage';

function isGetAssingmentResponse(res: unknown): res is TGetAssingmentResponse {
  return (
    !!res && typeof res === 'object' && Object.keys(res).some(key => ['assignment', 'assignmentEnum'].includes(key))
  );
}

export type TCommentRequest = {
  id?: number;
  assignmentId: number;
  text: string;
  user: string;
};

export type TComment = {
  createdBy: {
    accountNonExpired: boolean;
    accountNonLocked: boolean;
    cohortStartDate: string;
    credentialsNonExpired: boolean;
    enabled: boolean;
    id: number;
    password: string;
    username: string;
    name: string;
  };
  createdDate: string;
  id: number;
  text: string;
};

export default function useAssignment() {
  const [assignment, setAssignment] = useState<TAssignment>();
  const [assignmentEnum, setAssignmentEnum] = useState<TAssignmentEnum[]>();
  const [assignmentStatusEnum, setAssignmentStatusEnum] = useState<TAssignmentStatusEnum[]>();
  const [selectedAssignment, setSelectedAssignment] = useState<string>();
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Array<TComment>>([]);
  const [editingComment, setEditingComment] = useState<TComment>();

  const params = useParams();
  const assignmentId = parseInt(params.assignmentId as string);
  const navigate = useNavigate();
  const prevAssignment = useRef(assignment);

  const [jwt] = useLocalState<string>('', 'jwt');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const isAssignmentCompleted = assignment?.status === 'Completed';

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

  const fetchAssignment = useCallback(
    async function (id: string | number) {
      try {
        const res = await ApiService.getAssignment(id);

        if (isGetAssingmentResponse(res)) {
          setAssignment(res.assignment);
          setAssignmentEnum(res.assignmentEnum);
          setAssignmentStatusEnum(res.assignmentStatusEnum);
        }
      } catch (error) {
        console.warn(error);
        setAssignment(undefined);
        setAssignmentEnum(undefined);
      }
    },
    [setAssignment, setAssignmentEnum, setAssignmentStatusEnum]
  );

  const updateAssignment = useCallback(
    function (prop: keyof TAssignment, value: string) {
      setAssignment(prev => ({ ...prev, [prop]: value } as TAssignment));
    },
    [setAssignment]
  );

  const persist = useCallback(
    async function () {
      try {
        if (!assignmentId) return;
        const response = await ApiService.saveAssignment(assignmentId, assignment);

        setAssignment(response);
      } catch (error) {
        console.error(error);
      }
    },
    [assignment, assignmentId, setAssignment]
  );
  const save = useCallback(
    async function (status: TAssignmentStatusValues) {
      if (!assignmentStatusEnum) return;

      if (assignment?.status !== status) {
        updateAssignment('status', status);
      } else {
        persist();
      }
    },
    [assignment?.status, assignmentStatusEnum, persist, updateAssignment]
  );

  useEffect(() => {
    if (!assignmentId) return;
    fetchAssignment(assignmentId);
    fetchComments();
  }, [assignmentId, fetchAssignment, fetchComments]);

  useEffect(() => {
    if (assignment?.status !== prevAssignment.current?.status) {
      persist();
    }
    prevAssignment.current = assignment;
  }, [assignment, persist]);

  return {
    comment,
    setComment,
    comments,
    setComments,
    assignment,
    setAssignment,
    assignmentEnum,
    setAssignmentEnum,
    assignmentStatusEnum,
    setAssignmentStatusEnum,
    selectedAssignment,
    setSelectedAssignment,
    fetchAssignment,
    updateAssignment,
    editingComment,
    isAssignmentCompleted,
    handleSubmitComment,
    handleDeleteComment,
    handleEditComment,
    navigate,
    persist,
    save,
    textareaRef,
  };
}
