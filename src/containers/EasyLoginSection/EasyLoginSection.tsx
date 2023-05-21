import { FormEvent } from 'react';
import { Container } from 'react-bootstrap';

export default function EasyLoginSection({
  sendLoginRequest,
}: {
  sendLoginRequest: (e: FormEvent, easyUser?: Pick<TUser, 'password' | 'username'>) => Promise<void>;
}) {
  return (
    <Container
      style={{
        position: 'fixed',
        bottom: '2rem',
        textAlign: 'center',
      }}
    >
      <Container
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '.2rem',
        }}
      >
        <div className='text-muted'>or login with a demo account:</div>
        <Container
          style={{ width: '180px' }}
          className='w-auto d-inline-block m-0 text-primary'
          role='button'
          onClick={e => {
            sendLoginRequest(e, { username: 'student', password: 'asdfasdf' });
          }}
        >
          #student
        </Container>
        <div className='text-muted'>or</div>

        <Container
          style={{ width: '180px' }}
          className='w-auto d-inline-block m-0 text-primary'
          role='button'
          onClick={e => {
            sendLoginRequest(e, { username: 'code_reviewer', password: 'asdfasdf' });
          }}
        >
          #code_reviewer
        </Container>
      </Container>
    </Container>
  );
}
