// File: utils/storage.js
import AsyncStorage from 'react-native-async-storage/async-storage';

// Save workout session
export const saveWorkout = async (workout) => {
  try {
    const existing = await getWorkouts();
    const updated = [workout, ...existing];
    await AsyncStorage.setItem('workouts', JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('Save failed', error);
    return false;
  }
};

// Get all workouts
export const getWorkouts = async () => {
  try {
    const data = await AsyncStorage.getItem('workouts');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Load failed', error);
    return [];
  }
};

// Save food log
export const saveFood = async (foodItem) => {
  try {
    const existing = await getFoods();
    const updated = [foodItem, ...existing];
    await AsyncStorage.setItem('foods', JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('Save food failed', error);
    return false;
  }
};

// Get all food logs
export const getFoods = async () => {
  try {
    const data = await AsyncStorage.getItem('foods');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Load foods failed', error);
    return [];
  }
};

// Save custom exercise
export const saveCustomExercise = async (exercise) => {
  try {
    const existing = await getCustomExercises();
    const updated = [...existing, exercise];
    await AsyncStorage.setItem('customExercises', JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('Save exercise failed', error);
    return false;
  }
};

// Get custom exercises
export const getCustomExercises = async () => {
  try {
    const data = await AsyncStorage.getItem('customExercises');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Load custom exercises failed', error);
    return [];
  }
};

// Clear all data (for testing)
export const clearAllData = async () => {
  try {
    await AsyncStorage.clear();
    return true;
  } catch (error) {
    console.error('Clear failed', error);
    return false;
  }
};