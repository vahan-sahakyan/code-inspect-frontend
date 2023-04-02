import { ChangeEvent, useCallback, useEffect } from 'react';
import { Badge, Button, ButtonGroup, Col, Container, DropdownButton, Form, Row } from 'react-bootstrap';
import DropdownItem from 'react-bootstrap/esm/DropdownItem';
import { useParams } from 'react-router-dom';

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

  async function save() {
    let status = assignment?.status;
    if (
      assignmentStatusEnum &&
      (!assignment?.status || assignment?.status === assignmentStatusEnum[0].status)
      //
    ) {
      status = assignmentStatusEnum[1].status;
    }
    try {
      if (!assignmentId) return;
      const response = await ApiService.saveAssignment(assignmentId, { ...assignment, status });

      setAssignment(response);
    } catch (error) {
      //
    }
  }

  useEffect(() => {
    assignmentId && fetchAssignment(assignmentId);
  }, [assignmentId, fetchAssignment]);

  function updateAssignment(prop: keyof Assignment, value: string) {
    setAssignment(prev => ({ ...prev, [prop]: value } as Assignment));
  }
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

        <Button variant='secondary' onClick={() => save()}>
          Submit Assignment
        </Button>
      </div>
    </Container>
  );
};

export default AssignmentView;
