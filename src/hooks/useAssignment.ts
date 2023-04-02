import { useState } from 'react';

import { Assignment } from '../pages/Dashboard/Dashboard';
import { AssignmentEnum, AssignmentStatusEnum } from '../services/apiService';

export default function useAssignment() {
  const [assignment, setAssignment] = useState<Assignment>();
  const [assignmentEnum, setAssignmentEnum] = useState<AssignmentEnum[]>();
  const [assignmentStatusEnum, setAssignmentStatusEnum] = useState<AssignmentStatusEnum[]>();
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
