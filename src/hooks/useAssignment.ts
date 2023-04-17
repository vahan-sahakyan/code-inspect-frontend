import { useState } from 'react';

import { TAssignment } from '../pages/Dashboard/Dashboard';
import { TAssignmentEnum, TAssignmentStatusEnum } from '../services/apiService';

export default function useAssignment() {
  const [assignment, setAssignment] = useState<TAssignment>();
  const [assignmentEnum, setAssignmentEnum] = useState<TAssignmentEnum[]>();
  const [assignmentStatusEnum, setAssignmentStatusEnum] = useState<TAssignmentStatusEnum[]>();
  const [selectedAssignment, setSelectedAssignment] = useState<string>();
  return {
    assignment,
    assignmentEnum,
    assignmentStatusEnum,
    selectedAssignment,
    setAssignment,
    setAssignmentEnum,
    setAssignmentStatusEnum,
    setSelectedAssignment,
  };
}
