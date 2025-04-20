import { AxiosError, AxiosResponse } from 'axios';
import { useSelector } from 'react-redux';

import { selectIsCodeReviewer } from '../redux/selectors';
import { TUser } from '../shared/types';
import useLocalState from './useLocalStorage';

const NULL_USER = { displayName: null, role: null, id: undefined, username: undefined };

export default function useUser() {
  const [loginResponse] = useLocalState<AxiosResponse<TUser> | AxiosError>({} as AxiosResponse<TUser>, 'loginResponse');
  const isCodeReviewer = useSelector(selectIsCodeReviewer);

  if (loginResponse.status !== 200 || !('data' in loginResponse)) return NULL_USER;

  const {
    data: { name: displayName, id, username },
  } = loginResponse;

  return { displayName, role: isCodeReviewer ? 'code reviewer' : 'student', id, username } as const;
}
