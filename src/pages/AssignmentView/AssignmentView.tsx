import { ChangeEvent, useCallback, useEffect, useRef } from 'react';
import { Badge, Button, ButtonGroup, Col, Container, DropdownButton, Form, Row } from 'react-bootstrap';
import DropdownItem from 'react-bootstrap/esm/DropdownItem';
import { useNavigate, useParams } from 'react-router-dom';

import { useAssignment } from '../../hooks';
import { ApiService } from '../../services';
import { GetAssingmentResponse } from '../../services/apiService';
import { Assignment } from '../Dashboard/Dashboard';

function isGetAssingmentResponse(res: unknown): res is GetAssingmentResponse {
  return (
    !!res && typeof res === 'object' && Object.keys(res).some(key => ['assignment', 'assignmentEnum'].includes(key))
  );
}

const AssignmentView = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { assignmentId } = params;

  const {
    assignment,
    setAssignment,
    assignmentEnum,
    setAssignmentEnum,
    assignmentStatusEnum,
    setAssignmentStatusEnum,
    selectedAssignment,
    setSelectedAssignment,
  } = useAssignment();

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
    function (prop: keyof Assignment, value: string) {
      setAssignment(prev => ({ ...prev, [prop]: value } as Assignment));
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
    async function () {
      if (
        assignmentStatusEnum &&
        (!assignment?.status || assignment?.status === assignmentStatusEnum[0].status)
        //
      ) {
        updateAssignment('status', assignmentStatusEnum[1].status);
      } else {
        persist();
      }
    },
    [assignment?.status, assignmentStatusEnum, persist, updateAssignment]
  );

  useEffect(() => {
    assignmentId && fetchAssignment(assignmentId);
  }, [assignmentId, fetchAssignment]);

  const prevAssignment = useRef(assignment);

  useEffect(() => {
    if (assignment?.status !== prevAssignment.current?.status) {
      persist();
    }
    prevAssignment.current = assignment;
  }, [assignment, persist]);

  return (
    <Container className='my-5'>
      <header className='d-flex flex-row justify-content-start gap-4 align-items-center flex-wrap '>
        {selectedAssignment || assignment?.number ? (
          <h2>Assignment {selectedAssignment || assignment?.number}</h2>
        ) : (
          <></>
        )}
        <Badge pill bg='info' style={{ fontSize: '1rem' }}>
          {assignment?.status?.toUpperCase()}
        </Badge>
      </header>

      <Form.Group as={Row} className='my-3' controlId='formPlaintextEmail'>
        <Form.Label column sm='3' md='2'>
          Assignment Number:
        </Form.Label>
        <Col sm='9' md='8' lg='6'>
          <DropdownButton
            variant='secondary'
            as={ButtonGroup}
            title={
              selectedAssignment || assignment?.number
                ? `Assignment ${selectedAssignment || assignment?.number}`
                : 'Select an Assignment'
            }
            onSelect={(eventKey: string | null) => {
              if (!eventKey) return;
              setSelectedAssignment(eventKey);
              updateAssignment('number', eventKey);
            }}
          >
            {assignmentEnum?.map(({ assignmentName, assignmentNum }) => (
              <DropdownItem
                key={assignmentNum}
                eventKey={assignmentNum}
                active={!!selectedAssignment && assignmentNum === +selectedAssignment}
                variant='secondary'
              >
                {assignmentName}
              </DropdownItem>
            ))}
          </DropdownButton>
        </Col>
      </Form.Group>
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

        <Button variant='secondary' className='me-3' onClick={() => save()}>
          Submit Assignment
        </Button>
        <Button variant='outline-secondary' className='px-4' onClick={() => navigate('/dashboard')}>
          Back
        </Button>
      </div>
    </Container>
  );
};

export default AssignmentView;
