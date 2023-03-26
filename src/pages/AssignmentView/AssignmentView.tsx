import React, { ChangeEvent, useEffect, useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import ApiService from '../../services/apiService';
import instance from '../../services/axios';
import useLocalState from '../../utils/useLocalStorage';
import { Assignment } from '../Dashboard/Dashboard';

const AssignmentView = () => {
  const params = useParams();
  const { assignmentId } = params;

  const [jwt, setJwt] = useLocalState('', 'jwt');
  const [assignment, setAssignment] = useState<Assignment | null>(null);

  async function fetchAssignment(id: string | number) {
    const res = await ApiService.getAssignment(id);
    console.log(res);
    setAssignment(res);
  }

  async function save() {
    try {
      if (!assignmentId) return;
      const response = await ApiService.saveAssignment(assignmentId, assignment);

      setAssignment(response);
    } catch (error) {}
  }

  useEffect(() => {
    assignmentId && fetchAssignment(assignmentId);
  }, []);

  function updateAssignment(prop: string, value: string) {
    setAssignment(prev => ({ ...prev, [prop]: value } as Assignment));
  }
  return (
    <Container className='d-flex justify-content-center align-items-center flex-column'>
      <div style={{ width: '350px' }} className='my-5 d-flex flex-column gap-2'>
        <h3>Assignment {assignmentId}</h3>
        <h6 style={{ color: '#646cff' }}>Status: {assignment?.status.toUpperCase()}</h6>
        <h6>
          <span style={{ display: 'inline-block', minWidth: '8rem' }}>Github URL:</span>
          <input
            type='url'
            value={assignment?.githubUrl ?? ''}
            onChange={(e: ChangeEvent<HTMLInputElement>) => updateAssignment('githubUrl', e.target.value)}
          />
        </h6>
        <h6>
          <span style={{ display: 'inline-block', minWidth: '8rem' }}>Branch:</span>
          <input
            type='text'
            value={assignment?.branch ?? ''}
            onChange={(e: ChangeEvent<HTMLInputElement>) => updateAssignment('branch', e.target.value)}
          />
        </h6>
        <Button variant='outline-secondary' style={{ padding: '.5rem 0' }} onClick={() => save()}>
          Submit Assignment
        </Button>
      </div>
    </Container>
  );
};

export default AssignmentView;
