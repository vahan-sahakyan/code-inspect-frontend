import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { socket } from '../App';
import { TAssignment } from '../pages/Dashboard/Dashboard';
import ApiService, {
  TAssignmentEnum,
  TAssignmentStatusEnum,
  TAssignmentStatusValues,
  TGetAssingmentResponse,
} from '../services/apiService';
import { TKafkaTopic } from '../shared/types';
import useMount from './useMount';
import useUnMount from './useUnMount';

function isGetAssingmentResponse(res: unknown): res is TGetAssingmentResponse {
  return (
    !!res && typeof res === 'object' && Object.keys(res).some(key => ['assignment', 'assignmentEnum'].includes(key))
  );
}

export default function useAssignment() {
  const [assignment, setAssignment] = useState<TAssignment>();
  const [assignmentEnum, setAssignmentEnum] = useState<TAssignmentEnum[]>();
  const [assignmentStatusEnum, setAssignmentStatusEnum] = useState<TAssignmentStatusEnum[]>();
  const [selectedAssignment, setSelectedAssignment] = useState<string>();

  const params = useParams();
  const assignmentId = parseInt(params.assignmentId as string);
  const navigate = useNavigate();
  const prevAssignment = useRef(assignment);

  const isAssignmentCompleted = assignment?.status === 'Completed';

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
  }, [assignmentId, fetchAssignment]);

  useEffect(() => {
    if (assignment?.status !== prevAssignment.current?.status) {
      prevAssignment.current?.status && persist();
    }
    prevAssignment.current = assignment;
  }, [assignment, persist]);

  const assignmentMessageHandler = (event: { data: string }) => {
    const { value } = JSON.parse(event.data) as TKafkaTopic;
    if (value.includes('CREATE ASSIGNMENT') || value.includes('UPDATE ASSIGNMENT')) fetchAssignment(assignmentId);
  };
  useMount(() => {
    socket.addEventListener('message', assignmentMessageHandler);
  });
  useUnMount(() => {
    socket.removeEventListener('message', assignmentMessageHandler);
  });
  return {
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
    isAssignmentCompleted,
    navigate,
    persist,
    save,
  };
}
