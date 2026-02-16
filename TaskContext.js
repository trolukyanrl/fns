import React, { createContext, useState, useContext, useEffect } from 'react';
import { tasksAPI } from './services/api';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await tasksAPI.getTasks();
      // Sort tasks by date (newest first) if possible
      const sortedTasks = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setTasks(sortedTasks);
      setError(null);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (taskData) => {
    setLoading(true);
    try {
      const response = await tasksAPI.createTask(taskData);
      setTasks([response.data, ...tasks]);
      return response.data;
    } catch (err) {
      console.error('Error adding task:', err);
      setError('Failed to add task');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (taskId) => {
    setLoading(true);
    try {
      await tasksAPI.deleteTask(taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Failed to delete task');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (taskId, updatedData) => {
    setLoading(true);
    try {
      const response = await tasksAPI.updateTask(taskId, updatedData);
      setTasks(tasks.map(task => task.id === taskId ? response.data : task));
      return response.data;
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Failed to update task');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <TaskContext.Provider value={{ tasks, loading, error, addTask, deleteTask, updateTask, refreshTasks: fetchTasks }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within TaskProvider');
  }
  return context;
};
