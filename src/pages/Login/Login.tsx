import { AxiosError, AxiosResponse } from 'axios';
import jwtDecode from 'jwt-decode';
import { ChangeEvent, FormEvent, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { EasyLoginSection } from '../../containers';
import { useLocalState, useMount, useToggle } from '../../hooks';
import { setUserRole } from '../../redux/user/user.slice';
import { instance } from '../../services';
import { TDecodedJwt } from '../../shared/types';

const { Group, Control } = Form;

export type TUser = {
  id?: number;
  name?: string;
  username?: string;
  password?: string;
  authorities?: string[];
};

const Login = () => {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState<string>();
  const [username, setUsername] = useState<string>();
  const [isValidationPhase, setIsValidationPhase] = useState<boolean>(false);
  const [password, setPassword] = useState<string>();
  const [errorFields, setErrorFields] = useState<Array<string | undefined>>([]);
  const [hasAccount, toggleHasAccount] = useToggle(false);
  const [jwt, setJwt] = useLocalState<string>('', 'jwt');
  const [, setLoginResponse] = useLocalState<AxiosResponse<TUser> | AxiosError>(
    {} as AxiosResponse<TUser>,
    'loginResponse'
  );

  const dispatch = useDispatch();
  const user: TUser = useMemo(
    () => ({
      username,
      password,
      name: displayName,
    }),
    [displayName, password, username]
  );

  useEffect(() => {
    if (jwt) navigate(`/dashboard`, { replace: true });
  }, [jwt, navigate]);

  async function sendLoginRequest(e: FormEvent, easyUser?: Pick<TUser, 'password' | 'username'>) {
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
  async function sendSignUpRequest(e: FormEvent) {
    e.preventDefault();
    setIsValidationPhase(true);
    checkErrors();
    if (jwt) return;
    if ((errorFields || []).some(n => !!n)) return;
    try {
      await instance.post('api/auth/signup', user);
      await sendLoginRequest(e);
    } catch (error) {
      setLoginResponse(error as AxiosError);
      let foo: SetStateAction<AxiosResponse<TUser, any>>;
      localStorage.removeItem('jwt');
      console.error('🔴 Invalid login attempt!');
    }
  }

  const checkErrors = useCallback(
    function () {
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

  function handleToggleChange() {
    setIsValidationPhase(false);
    toggleHasAccount();
    setUsername('');
    setPassword('');
    setDisplayName('');
  }

  const isRed = (fieldName: string) => errorFields?.includes(fieldName) && isValidationPhase && 'border-danger';
  return (
    <Container style={{ height: '90vh' }} className='d-flex align-items-center justify-content-center'>
      <Container style={{ padding: '0', width: '400px' }}>
        <div className='mb-4 d-flex justify-content-between'>
          <h3 className='opacity-100'>#code_inspect</h3>
        </div>
        {!hasAccount && (
          <Group style={{ transition: '200ms' }} className='my-3 d-flex align-items-center gap-3' controlId='name'>
            <Control
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
          </Group>
        )}
        <Group className='my-3 d-flex align-items-center gap-3' controlId='username'>
          <Control
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
        </Group>
        <Group className='my-3 d-flex align-items-center gap-3' controlId='password'>
          <Control
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
        </Group>

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
