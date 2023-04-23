const roles = ['ROLE_STUDENT', 'ROLE_CODE_REVIEWER'] as const;
export type TRole = (typeof roles)[number];

export type TDecodedJwt = {
  exp: number;
  iat: number;
  sub: string;
  authorities: Array<TRole>;
};
