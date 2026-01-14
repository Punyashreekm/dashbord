import { useState, useCallback } from 'react';
import api from '../services/api';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/tasks');
      setTasks(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = async (taskData) => {
    try {
      const { data } = await api.post('/tasks', taskData);
      setTasks((prev) => [...prev, data]);
      return data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Error creating task');
    }
  };

  const updateTask = async (id, taskData) => {
    try {
      const { data } = await api.put(`/tasks/${id}`, taskData);
      setTasks((prev) => prev.map((t) => (t._id === id ? data : t)));
      return data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Error updating task');
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Error deleting task');
    }
  };

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  };
};
