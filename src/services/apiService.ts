import { AxiosError, AxiosResponse } from 'axios';

import { Assignment } from '../pages/Dashboard/Dashboard';
import instance from './axios';

export type AssignmentStatusValues = 'Pending Submission' | 'Submitted' | 'In Review' | 'Needs Update' | 'Completed';

export type AssignmentEnum = {
  assignmentName: string;
  assignmentNum: number;
};

export type AssignmentStatusEnum = {
  status: AssignmentStatusValues;
  step: number;
};

export type GetAssingmentResponse = {
  assignment: Assignment;
  assignmentEnum: AssignmentEnum[];
  assignmentStatusEnum: AssignmentStatusEnum[];
};

abstract class ApiService {
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

  static getAssignment = async (id: number | string): Promise<GetAssingmentResponse | AxiosError> => {
    try {
      const response: AxiosResponse<GetAssingmentResponse> = await instance.get(`/api/assignments/${id}`, {
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
  ////////
  ////////
  ////////
  ////////
  static __deletePhoto = async (id: number) => {
    await instance.delete(`http://localhost:8080/photos/${id}`);
  };
}

export default ApiService;
