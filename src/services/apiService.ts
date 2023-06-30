import { AxiosError, AxiosResponse } from 'axios';

import { TCommentRequest } from '../components/Comment/Comment.types';
import { TAssignment } from '../pages/Dashboard/Dashboard';
import instance from './axios';

export type TAssignmentStatusValues =
  | 'Pending Submission'
  | 'Submitted'
  | 'In Review'
  | 'Needs Update'
  | 'Completed'
  | 'Resubmitted';

export type TAssignmentEnum = {
  assignmentName: string;
  assignmentNum: number;
};

export type TAssignmentStatusEnum = {
  status: TAssignmentStatusValues;
  step: number;
};

export type TGetAssingmentResponse = {
  assignment: TAssignment;
  assignmentEnum: TAssignmentEnum[];
  assignmentStatusEnum: TAssignmentStatusEnum[];
};

export default abstract class ApiService {
  static getJwt = () => JSON.parse(localStorage.getItem('jwt') || '');

  static getAssignments = async () => {
    const { data } = await instance.get('/api/assignments', {
      headers: { Authorization: `Bearer ${ApiService.getJwt()}` },
    });
    return data;
  };

  static createAssignment = async () => {
    try {
      const { data } = await instance.post('/api/assignments', null, {
        headers: { Authorization: `Bearer ${ApiService.getJwt()}` },
      });
      return data;
    } catch (error) {
      throw error as Error;
    }
  };

  static getAssignment = async (id: number | string): Promise<TGetAssingmentResponse | AxiosError> => {
    try {
      const response: AxiosResponse<TGetAssingmentResponse> = await instance.get(`/api/assignments/${id}`, {
        headers: { Authorization: `Bearer ${ApiService.getJwt()}` },
      });

      return response.data;
    } catch (error) {
      throw error as Error;
    }
  };

  static saveAssignment = async (id: string | number, assignment: unknown) => {
    try {
      const response = await instance.put(`/api/assignments/${id}`, assignment, {
        headers: { Authorization: `Bearer ${ApiService.getJwt()}` },
      });

      return response?.data;
    } catch (error) {
      throw error as Error;
    }
  };

  static claimAssignment = async (assignment: TAssignment) => {
    try {
      const response = await instance.put(`/api/assignments/${assignment.id}`, assignment, {
        headers: { Authorization: `Bearer ${ApiService.getJwt()}` },
      });

      return response?.data;
    } catch (error) {
      throw error as Error;
    }
  };

  static postComment = async (body: TCommentRequest) => {
    try {
      const response = await instance.post('/api/comments', body, {
        headers: { Authorization: `Bearer ${ApiService.getJwt()}` },
      });
      return response?.data;
    } catch (error) {
      throw error as Error;
    }
  };

  static async getComments(assignmentId: number | undefined) {
    try {
      const response = await instance.get(`/api/comments?assignmentId=${assignmentId}`, {
        headers: { Authorization: `Bearer ${ApiService.getJwt()}` },
      });
      return response.data;
    } catch (error) {
      throw error as Error;
    }
  }

  static editComment = async (body: TCommentRequest) => {
    try {
      const response = await instance.put(`/api/comments/${body.id}`, body, {
        headers: { Authorization: `Bearer ${ApiService.getJwt()}` },
      });
      return response?.data;
    } catch (error) {
      throw error as Error;
    }
  };

  static deleteComment = async (commentId: number) => {
    try {
      const response = await instance.delete(`/api/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${ApiService.getJwt()}` },
      });
      return response?.data;
    } catch (error) {
      throw error as Error;
    }
  };
}
