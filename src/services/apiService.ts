import instance from './axios';

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
      //
    }
  };

  static getAssignment = async (id: number | string) => {
    try {
      const response = await instance.get(`/api/assignments/${id}`, {
        headers: { Authorization: `Bearer ${ApiService.getJwt()}` },
      });
      return response.data;
    } catch (error) {
      //
    }
  };

  static saveAssignment = async (id: string | number, assignment: unknown) => {
    try {
      const response = await instance.put(`/api/assignments/${id}`, assignment, {
        headers: { Authorization: `Bearer ${ApiService.getJwt()}` },
      });

      return response?.data;
    } catch (error) {
      //
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
