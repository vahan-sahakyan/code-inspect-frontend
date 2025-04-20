import './Login.scss';

import { AxiosError, AxiosResponse } from 'axios';
import jwtDecode from 'jwt-decode';
import { ChangeEvent, FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { EasyLoginSection } from '../../containers';
import { useLocalState, useMount, useToggle } from '../../hooks';
import { setUserRole } from '../../redux/user/user.slice';
import { instance } from '../../services';
import { TAuthRequestDto, TDecodedJwt } from '../../shared/types';

const Login = () => {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState<string>();
  const [username, setUsername] = useState<string>();
  const [isValidationPhase, setIsValidationPhase] = useState<boolean>(false);
  const [password, setPassword] = useState<string>();
  const [errorFields, setErrorFields] = useState<Array<string | undefined>>([]);
  const [hasAccount, toggleHasAccount] = useToggle(false);
  const [jwt, setJwt] = useLocalState<string>('', 'jwt');
  const [isCodeReviewer, setIsCodeReviewer] = useState<boolean>(false);

  const [, setLoginResponse] = useLocalState<AxiosResponse<TAuthRequestDto> | AxiosError>(
    {} as AxiosResponse<TAuthRequestDto>,
    'loginResponse'
  );

  const dispatch = useDispatch();
  const user: TAuthRequestDto = useMemo(
    () => ({
      username,
      password,
      name: displayName,
      authority: isCodeReviewer ? 'ROLE_CODE_REVIEWER' : 'ROLE_STUDENT',
    }),
    [displayName, isCodeReviewer, password, username]
  );

  useEffect(() => {
    if (jwt) navigate(`/dashboard`, { replace: true });
  }, [jwt, navigate]);

  /**
   * Handles the toggle change between student and code reviewer
   * @param e event
   */
  const handleRoleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsCodeReviewer(e.target.checked);
  };

  /**
   * Handles the login request
   * @param e login submit event
   * @param easyUser optional user object for easy login
   * @returns
   */
  async function sendLoginRequest(e: FormEvent, easyUser?: TAuthRequestDto) {
    e.preventDefault();
    if (!easyUser) {
      setIsValidationPhase(true);
      checkErrors();
    }
    if (jwt) return;
    if ((errorFields || []).some(n => !!n) && !easyUser) return;
    try {
      const response = await instance.post('api/auth/login', easyUser || user);
      setLoginResponse(response);
      const { password } = response?.data;
      const { authorities } = jwtDecode(password) as TDecodedJwt;
      setJwt(password);
      dispatch(setUserRole(authorities.at(0) as string));
    } catch (error) {
      setLoginResponse(error as AxiosError);
      localStorage.removeItem('jwt');
      console.error('🔴 Invalid login attempt!');
    }
  }

  /**
   * Handles the sign-up request
   */
  async function sendSignUpRequest(e: FormEvent): Promise<void> {
    e.preventDefault();
    console.log({ user });
    setIsValidationPhase(true);
    checkErrors();
    if (jwt) return;
    if ((errorFields || []).some(n => !!n)) return;
    try {
      await instance.post('api/auth/signup', user);
      await sendLoginRequest(e);
    } catch (error) {
      setLoginResponse(error as AxiosError);
      localStorage.removeItem('jwt');
      console.error('🔴 Invalid login attempt!');
    }
  }

  /**
   * Checks for errors in the form fields
   */
  const checkErrors = useCallback(
    function (): void {
      const fields = ['password', 'username'];
      if (!hasAccount) fields.push('name');
      const items = Object.entries(user)
        .filter(([key]) => fields.includes(key))
        .map(([key, val]) => (!val ? key : undefined));
      setErrorFields(items);
    },
    [hasAccount, user]
  );

  useMount(checkErrors);

  /**
   * Handles the toggle change between login and signup
   */
  function handleToggleChange(): void {
    setIsValidationPhase(false);
    toggleHasAccount();
    setUsername('');
    setPassword('');
    setDisplayName('');
    setIsCodeReviewer(false);
  }

  const isRed = (fieldName: string) => errorFields?.includes(fieldName) && isValidationPhase && 'border-danger';

  return (
    <Container style={{ height: '90vh' }} className='d-flex align-items-center justify-content-center login-container'>
      <Container style={{ padding: '0', width: '400px' }}>
        <div className='mb-4 d-flex justify-content-between'>
          <h3 className='opacity-100'>#code_inspect</h3>
        </div>
        {!hasAccount && (
          <Form.Group style={{ transition: '200ms' }} className='my-3 d-flex align-items-center gap-3' controlId='name'>
            <Form.Control
              value={displayName}
              type='text'
              required
              placeholder='Display Name'
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setDisplayName(e.target.value?.trim?.());
                setIsValidationPhase(false);
              }}
              className={`rounded-0 ${isRed('name')}`}
            />
          </Form.Group>
        )}
        <Form.Group className='my-3 d-flex align-items-center gap-3' controlId='username'>
          <Form.Control
            value={username}
            type='text'
            required
            placeholder='Email or Username'
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setUsername(e.target.value?.trim?.());
              setIsValidationPhase(false);
            }}
            className={`rounded-0 ${isRed('username')}`}
          />
        </Form.Group>
        <Form.Group className='my-3 d-flex align-items-center gap-3' controlId='password'>
          <Form.Control
            value={password}
            type='password'
            required
            placeholder='Password'
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setPassword(e.target.value);
              setIsValidationPhase(false);
            }}
            className={`rounded-0 ${isRed('password')}`}
          />
        </Form.Group>
        {!hasAccount && (
          <Form.Group controlId='role'>
            <Form.Check
              onChange={handleRoleChange}
              type='switch'
              id='custom-switch'
              label='code reviewer'
              checked={isCodeReviewer}
            />
          </Form.Group>
        )}
        <Button
          style={{ width: '400px' }}
          className='my-3 button rounded-0'
          variant='dark'
          type='submit'
          onClick={hasAccount ? sendLoginRequest : sendSignUpRequest}
        >
          {hasAccount ? 'Login' : 'Sign up'}
        </Button>
        <Button
          style={{ width: '400px' }}
          className='rounded-0 btn-outline-dark'
          variant='light'
          type='submit'
          onClick={() => navigate('/')}
        >
          Cancel
        </Button>

        <Container onClick={handleToggleChange} role='button' className='ps-0 my-4 text-primary d-inline-block w-auto'>
          {!hasAccount ? 'I have an account' : 'Create a new account'}
        </Container>
      </Container>
      <EasyLoginSection sendLoginRequest={sendLoginRequest} />
    </Container>
  );
};

export default Login;
