import { AxiosError, AxiosResponse } from 'axios';
import jwtDecode from 'jwt-decode';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { TDecodedJwt } from '../../App';
import { useLocalState } from '../../hooks';
import { selectUserRole } from '../../redux/selectors';
import { setUserRole } from '../../redux/user/user.slice';
import { instance } from '../../services';
const { Group, Control } = Form;

export type TUser = {
  id?: number;
  username?: string;
  password?: string;
  authorities?: string[];
};

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();
  const dispatch = useDispatch();
  const user: TUser = {
    username,
    password,
  };
  const [jwt, setJwt] = useLocalState<string>('', 'jwt');
  const [, setLoginResponse] = useLocalState<AxiosResponse<TUser> | AxiosError>(
    {} as AxiosResponse<TUser>,
    'loginResponse'
  );
  const isCodeReviewer = useSelector(selectUserRole);

  useEffect(() => {
    if (jwt) navigate(`/dashboard`, { replace: true });
  }, [jwt, navigate]);

  async function sendLoginRequest(e: FormEvent) {
    e.preventDefault();
    if (jwt) return;
    try {
      const response = await instance.post('api/auth/login', user);
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
  return (
    <Container style={{ height: '100vh' }} className='d-flex align-items-center justify-content-center'>
      <Container style={{ padding: '0', width: '400px' }}>
        <h3 className='mb-4'>#code_inspect</h3>
        <Group className='my-3 d-flex align-items-center gap-3' controlId='username'>
          <Control
            type='text'
            placeholder='Email or Username'
            onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
            className='rounded-0'
          />
        </Group>
        <Group className='my-3 d-flex align-items-center gap-3' controlId='password'>
          <Control
            type='password'
            placeholder='Password'
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            className='rounded-0'
          />
        </Group>
        <Button
          style={{ width: '400px' }}
          className='my-3 button rounded-0'
          variant='dark'
          type='submit'
          onClick={sendLoginRequest}
        >
          Login
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
      </Container>
    </Container>
  );
};

export default Login;
