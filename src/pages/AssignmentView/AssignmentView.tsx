import React, { ChangeEvent, useEffect, useState } from 'react';
import { Badge, Button, Col, Container, Form, Row } from 'react-bootstrap';
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
    <Container className='my-5'>
      <header className='d-flex flex-row justify-content-start gap-4 align-items-center flex-wrap '>
        <h2>Assignment&nbsp;#{assignmentId}</h2>
        <Badge pill bg='info' style={{ fontSize: '1rem' }}>
          {assignment?.status.toUpperCase()}
        </Badge>
      </header>
      <div>
        <Form.Group as={Row} className='my-3' controlId='formPlaintextEmail'>
          <Form.Label column sm='3' md='2'>
            GitHub&nbsp;URL:
          </Form.Label>
          <Col sm='9' md='8' lg='6'>
            <Form.Control
              type='url'
              value={assignment?.githubUrl ?? ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) => updateAssignment('githubUrl', e.target.value)}
              placeholder='https://github.com/username/repo-name'
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className='my-3' controlId='formPlaintextEmail'>
          <Form.Label column sm='3' md='2'>
            Branch:
          </Form.Label>
          <Col sm='9' md='8' lg='6'>
            <Form.Control
              type='text'
              value={assignment?.branch ?? ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) => updateAssignment('branch', e.target.value)}
              placeholder='example-branch-name'
            />
          </Col>
        </Form.Group>

        <Button variant='secondary' onClick={() => save()}>
          Submit Assignment
        </Button>
      </div>
    </Container>
  );
};

export default AssignmentView;
