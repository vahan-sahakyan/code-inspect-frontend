const roles = ['ROLE_STUDENT', 'ROLE_CODE_REVIEWER'] as const;
export type TRole = (typeof roles)[number];

export type TDecodedJwt = {
  exp: number;
  iat: number;
  sub: string;
  authorities: Array<TRole>;
};

export type TKafkaTopic = {
  highWaterOffset: number;
  key: number;
  offset: number;
  partition: number;
  topic: string;
  value: string;
};

export type TUser = {
  id?: number;
  name?: string;
  username?: string;
  password?: string;
  authorities?: TRole[];
};

export type TAuthRequestDto = {
  username?: string;
  password?: string;
  name?: string;
  authority?: string;
};
