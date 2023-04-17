import './CodeReviewAssignmentView.scss';

import { css } from '@emotion/css';
import { ChangeEvent, useCallback, useEffect, useRef } from 'react';
import { Badge, Button, ButtonGroup, Col, Container, DropdownButton, Form, Row } from 'react-bootstrap';
import DropdownItem from 'react-bootstrap/esm/DropdownItem';
import { useNavigate, useParams } from 'react-router-dom';

import { ReactComponent as CopySVG } from '../../../public/copy.svg';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import { useAssignment } from '../../hooks';
import { ApiService } from '../../services';
import { TAssignmentStatusValues, TGetAssingmentResponse } from '../../services/apiService';
import { styled, styles } from '../CodeReviewerDashboard/CodeReviewerDashboard.styles';
import { TAssignment } from '../Dashboard/Dashboard';

function isGetAssingmentResponse(res: unknown): res is TGetAssingmentResponse {
  return (
    !!res && typeof res === 'object' && Object.keys(res).some(key => ['assignment', 'assignmentEnum'].includes(key))
  );
}

const CodeReviewAssignmentView = () => {
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
    <Container className='my-5 code-review-assignment-view'>
      <header className='d-flex flex-row justify-content-start gap-4 align-items-center flex-wrap '>
        {selectedAssignment || assignment?.number ? (
          <h2>Assignment #{selectedAssignment || assignment?.number}</h2>
        ) : (
          <></>
        )}
        <StatusBadge className='rounded-0' text={assignment?.status?.toUpperCase()} style={{ fontSize: '1rem' }} />
      </header>

      <div>
        <Form.Group as={Row} className='my-3 d-flex align-items-center' controlId='formPlaintextGitHubUrl'>
          <Form.Label column sm='3' md='2'>
            GitHub&nbsp;URL:
          </Form.Label>
          <Col sm='9' md='8' lg='6'>
            <a target={'_blank'} href={assignment?.githubUrl} rel='noreferrer'>
              {assignment?.githubUrl}
            </a>
          </Col>
        </Form.Group>
        <Form.Group as={Row} className='my-3 d-flex align-items-center' controlId='formPlaintextBranch'>
          <Form.Label column sm='3' md='2'>
            Branch:
          </Form.Label>
          <Col sm='9' md='8' lg='6'>
            {assignment?.branch}
            <CopySVG
              className={styled.copy}
              onClick={() => navigator.clipboard.writeText(assignment?.branch as string)}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className='my-3 d-flex align-items-center' controlId='formPlaintextBran'>
          <Form.Label column sm='3' md='2'>
            Review Video URL:
          </Form.Label>
          <Col sm='9' md='8' lg='6'>
            <Form.Control
              type='text'
              value={assignment?.codeReviewVideoUrl ?? ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) => updateAssignment('codeReviewVideoUrl', e.target.value)}
              placeholder='https://www.youtube.com/your-review'
              className='rounded-0'
            />
          </Col>
        </Form.Group>
        <Col sm='12' md='10' lg='8' className='pe-lg-2 pe-md-1 pe-sm-0'>
          <Container className='m-0 p-0 d-flex justify-content-end'>
            <Button variant='outline-dark' className='px-3 me-3 rounded-0' onClick={() => navigate('/dashboard')}>
              Go Back
            </Button>
            {assignment?.status === 'Needs Update' ? (
              <Button variant='dark' className='px-4 me-3 rounded-0' onClick={() => save('In Review')}>
                Re-Claim
              </Button>
            ) : (
              <Button variant='danger' className='px-4 me-3 rounded-0' onClick={() => save('Needs Update')}>
                Reject Assignment
              </Button>
            )}

            {assignment?.status === 'Completed' ? (
              <Button variant='dark' className='px-4 rounded-0' onClick={() => save('In Review')}>
                Re-Claim
              </Button>
            ) : (
              <Button variant='success' className='px-4 rounded-0' onClick={() => save('Completed')}>
                Complete Review
              </Button>
            )}
          </Container>
        </Col>
      </div>
    </Container>
  );
};

export default CodeReviewAssignmentView;
