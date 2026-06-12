// File: utils/prCalculator.js

// Calculate Personal Records from all workouts
export const calculatePRs = (workouts) => {
  const prMap = new Map(); // exerciseName -> { maxWeight, reps, date }
  
  workouts.forEach(workout => {
    if (!workout.exercises) return;
    
    workout.exercises.forEach(ex => {
      const exerciseName = ex.name;
      const weight = parseFloat(ex.weight);
      const reps = parseInt(ex.reps);
      const date = workout.date;
      
      if (!prMap.has(exerciseName)) {
        prMap.set(exerciseName, { maxWeight: weight, reps, date });
      } else {
        const current = prMap.get(exerciseName);
        if (weight > current.maxWeight) {
          prMap.set(exerciseName, { maxWeight: weight, reps, date });
        }
      }
    });
  });
  
  // Convert map to array sorted by weight descending
  const prArray = Array.from(prMap.entries()).map(([name, data]) => ({
    name,
    maxWeight: data.maxWeight,
    reps: data.reps,
    date: data.date
  }));
  
  return prArray.sort((a, b) => b.maxWeight - a.maxWeight);
};

// Check if a new set is a PR
export const isNewPR = (exerciseName, weight, currentPRs) => {
  const existing = currentPRs.find(pr => pr.name === exerciseName);
  if (!existing) return true;
  return weight > existing.maxWeight;
};

// Get motivational message based on PR
export const getPRMessage = (exerciseName, newWeight, oldWeight) => {
  const difference = newWeight - oldWeight;
  if (difference >= 20) return `💪 MONSTER GAIN! ${difference}kg increase on ${exerciseName}!`;
  if (difference >= 10) return `🔥 Strong! ${exerciseName} up by ${difference}kg!`;
  if (difference >= 5) return `📈 Progress! ${exerciseName} +${difference}kg`;
  return `✅ New PR on ${exerciseName}: ${newWeight}kg!`;
};