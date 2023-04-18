import './AssignmentView.scss';

import { css } from '@emotion/css';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { Button, ButtonGroup, Col, Container, DropdownButton, Form, Row } from 'react-bootstrap';
import DropdownItem from 'react-bootstrap/esm/DropdownItem';
import { useNavigate, useParams } from 'react-router-dom';

import { Comment } from '../../components';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import { useAssignment, useLocalState } from '../../hooks';
import { ApiService } from '../../services';
import { TAssignmentStatusValues, TGetAssingmentResponse } from '../../services/apiService';
import { TAssignment } from '../Dashboard/Dashboard';
function isGetAssingmentResponse(res: unknown): res is TGetAssingmentResponse {
  return (
    !!res && typeof res === 'object' && Object.keys(res).some(key => ['assignment', 'assignmentEnum'].includes(key))
  );
}

export type TCommentRequest = {
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

const AssignmentView = () => {
  const params = useParams();
  const navigate = useNavigate();
  const assignmentId = parseInt(params.assignmentId as string);
  const [jwt] = useLocalState<string>('', 'jwt');
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<TComment[]>([]);

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

  const submitComment = useCallback(
    async function () {
      const response: TComment = await ApiService.postComment({
        assignmentId: assignmentId,
        text: comment,
        user: jwt,
      });

      setComments([response, ...comments]);
      setComment('');
    },
    [assignmentId, comment, comments, jwt]
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

  useEffect(() => {
    assignmentId && fetchAssignment(assignmentId);
  }, [assignmentId, fetchAssignment]);

  useEffect(() => {
    assignmentId && fetchComments();
  }, [assignmentId, fetchComments]);

  const prevAssignment = useRef(assignment);

  useEffect(() => {
    if (assignment?.status !== prevAssignment.current?.status) {
      persist();
    }
    prevAssignment.current = assignment;
  }, [assignment, persist]);
  const isAssignmentCompleted = assignment?.status === 'Completed';

  return (
    <Container className='my-5 assignment-view'>
      <header className='d-flex flex-row justify-content-start gap-4 align-items-center flex-wrap '>
        {selectedAssignment || assignment?.number ? (
          <h2>Assignment #{selectedAssignment || assignment?.number}</h2>
        ) : (
          <></>
        )}
        <StatusBadge className='rounded-0' text={assignment?.status?.toUpperCase()} style={{ fontSize: '1rem' }} />
      </header>

      <Form.Group as={Row} className='my-3' controlId='formPlaintextEmail'>
        <Form.Label column sm='3' md='2'>
          Assignment Number:
        </Form.Label>
        <Col sm='9' md='8' lg='6'>
          <DropdownButton
            variant={isAssignmentCompleted ? 'outline-secondary' : 'dark'}
            // variant='outline-secondary'
            as={ButtonGroup}
            title={
              selectedAssignment || assignment?.number
                ? `Assignment #${selectedAssignment || assignment?.number}`
                : 'Select an Assignment'
            }
            onSelect={(eventKey: string | null) => {
              if (!eventKey) return;
              setSelectedAssignment(eventKey);
              updateAssignment('number', eventKey);
            }}
            style={{ borderRadius: 0 }}
            className={`rounded-0 ${isAssignmentCompleted ? 'bg-secondary bg-opacity-25' : ''}`}
            disabled={isAssignmentCompleted}
          >
            {assignmentEnum?.map(({ assignmentName, assignmentNum }) => (
              <DropdownItem
                key={assignmentNum}
                eventKey={assignmentNum}
                active={
                  selectedAssignment ? assignmentNum === +selectedAssignment : assignmentNum === assignment?.number
                }
                className={css`
                  &.active,
                  &:active {
                    background-color: black;
                  }
                `}
              >
                {assignmentName}
              </DropdownItem>
            ))}
          </DropdownButton>
        </Col>
      </Form.Group>
      <div>
        <Form.Group as={Row} className='my-3' controlId='formPlaintextGitHubUrl'>
          <Form.Label column sm='3' md='2'>
            GitHub&nbsp;URL:
          </Form.Label>
          <Col sm='9' md='8' lg='6'>
            <Form.Control
              type='url'
              value={assignment?.githubUrl ?? ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) => updateAssignment('githubUrl', e.target.value)}
              placeholder='https://github.com/username/repo-name'
              className='rounded-0'
              disabled={isAssignmentCompleted}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className='my-3' controlId='formPlaintextBranch'>
          <Form.Label column sm='3' md='2'>
            Branch:
          </Form.Label>
          <Col sm='9' md='8' lg='6'>
            <Form.Control
              type='text'
              value={assignment?.branch ?? ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) => updateAssignment('branch', e.target.value)}
              placeholder='example-branch-name'
              className='rounded-0'
              disabled={isAssignmentCompleted}
            />
          </Col>
        </Form.Group>
        {isAssignmentCompleted ? (
          <>
            <Form.Group as={Row} className='my-3 d-flex align-items-center' controlId='formPlaintextBranch'>
              <Form.Label column sm='3' md='2'>
                Review Video Url:
              </Form.Label>
              <Col sm='9' md='8' lg='6'>
                <a target={'_blank'} href={assignment?.codeReviewVideoUrl} rel='noreferrer'>
                  {assignment?.codeReviewVideoUrl}
                </a>
              </Col>
            </Form.Group>
            <Col sm='12' md='10' lg='8' className='pe-lg-2 pe-md-1 pe-sm-0'>
              <Container className='m-0 p-0 d-flex justify-content-end'>
                <Button variant='outline-dark' className='px-3  rounded-0' onClick={() => navigate('/dashboard')}>
                  Go Back
                </Button>
              </Container>
            </Col>
          </>
        ) : (
          <Col sm='12' md='10' lg='8' className='pe-lg-2 pe-md-1 pe-sm-0'>
            <Container className='m-0 p-0 d-flex justify-content-end'>
              <Button variant='outline-dark' className='px-3 me-3 rounded-0' onClick={() => navigate('/dashboard')}>
                Go Back
              </Button>

              {assignment?.status === 'Pending Submission' ? (
                <Button variant='dark' className='px-4 rounded-0' onClick={() => save('Submitted')}>
                  Submit Assignment
                </Button>
              ) : (
                <Button variant='dark' className='px-4 rounded-0' onClick={() => save('Resubmitted')}>
                  Resubmit Assignment
                </Button>
              )}
            </Container>
          </Col>
        )}
      </div>
      <Col sm='12' md='10' lg='8' className='pe-lg-2 pe-md-1 pe-sm-0 mt-5'>
        <textarea
          className={css`
            width: 100%;
            padding: 0.5rem 0.7rem;
            outline: none;
            height: 4rem;
          `}
          value={comment}
          onChange={e => setComment(e.target.value)}
        />
        <div className='d-flex justify-content-end'>
          <Button variant='dark' onClick={submitComment}>
            Post Comment
          </Button>
        </div>
        <div className='comments-container mt-4'>
          {comments.map(comment => (
            <Comment comment={comment} key={comment.id} />
          ))}
        </div>
      </Col>
    </Container>
  );
};

export default AssignmentView;
