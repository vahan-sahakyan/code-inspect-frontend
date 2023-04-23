export type TCommentRequest = {
  id?: number;
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

export type TCommentProps = {
  comment: TComment;
  deleteComment: (id: number) => void;
  editComment: (id: number) => void;
};
