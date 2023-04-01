import { AxiosError, AxiosResponse } from 'axios';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { instance } from '../../services';
import { useLocalState } from '../../utils';
const { Group, Control } = Form;

export type User = {
  username?: string;
  password?: string;
};

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const user: User = {
    username,
    password,
  };
  const [jwt, setJwt] = useLocalState<string>('', 'jwt');
  const [, setLoginResponse] = useLocalState<AxiosResponse<User> | AxiosError>(
    {} as AxiosResponse<User>,
    'loginResponse'
  );

  useEffect(() => {
    if (jwt) navigate(`/dashboard`);
    console.log(`JWT: ${jwt}`);
  }, [jwt, navigate]);

  async function sendLoginRequest(e: FormEvent) {
    e.preventDefault();
    if (jwt) return;
    try {
      const response = await instance.post('api/auth/login', user);
      setLoginResponse(response);
      setJwt(response?.data.password);
    } catch (error) {
      setLoginResponse(error as AxiosError);
      localStorage.removeItem('jwt');
      console.error('🔴 Invalid login attempt!');
    }
  }
  return (
    <Container style={{ height: '100vh' }} className='d-flex align-items-center justify-content-center'>
      <Container style={{ padding: '0', width: '400px' }}>
        <Group className='my-3 d-flex align-items-center gap-3' controlId='username'>
          <Control
            type='text'
            placeholder='Email or Username'
            onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
          />
        </Group>
        <Group className='my-3 d-flex align-items-center gap-3' controlId='password'>
          <Control
            type='password'
            placeholder='Password'
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          />
        </Group>
        <Button
          style={{ width: '400px' }}
          className='my-3 button'
          variant='secondary'
          type='submit'
          onClick={sendLoginRequest}
        >
          Login
        </Button>
        <Button
          style={{ width: '400px' }}
          className='border-0'
          variant='light'
          type='submit'
          onClick={() => navigate('/')}
        >
          Cancel
        </Button>
      </Container>
    </Container>
  );
};

export default Login;
