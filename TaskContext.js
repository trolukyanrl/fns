<<<<<<< HEAD
import React, { createContext, useState, useContext } from 'react';
=======
import React, { createContext, useState, useContext, useEffect } from 'react';
import { tasksAPI } from './services/api';
>>>>>>> bcknd

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
<<<<<<< HEAD

  const addTask = (task) => {
    const newTask = {
      id: Date.now().toString(),
      ...task,
      createdAt: new Date().toLocaleDateString(),
    };
    setTasks([newTask, ...tasks]);
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const updateTask = (taskId, updatedTask) => {
    setTasks(tasks.map(task => task.id === taskId ? { ...task, ...updatedTask } : task));
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, deleteTask, updateTask }}>
=======
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
      
      // The API response should now have the transformed data with distinct field names
      const transformedTask = response.data;
      
      // Ensure the task is properly formatted with distinct field names
      if (transformedTask.baSets && Array.isArray(transformedTask.baSets)) {
        transformedTask.baSets = transformedTask.baSets.map(asset => ({
          ...asset,
          assetId: asset.assetId || asset.id, // Keep assetId
          taskId: transformedTask.id, // Add taskId reference
        }));
      }
      
      if (transformedTask.safetyKits && Array.isArray(transformedTask.safetyKits)) {
        transformedTask.safetyKits = transformedTask.safetyKits.map(asset => ({
          ...asset,
          assetId: asset.assetId || asset.id, // Keep assetId
          taskId: transformedTask.id, // Add taskId reference
        }));
      }
      
      setTasks([transformedTask, ...tasks]);
      return transformedTask;
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
>>>>>>> bcknd
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
