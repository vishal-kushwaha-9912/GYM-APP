// File: data/exercisesData.js

export const exercisesList = [
  {
    id: '1',
    name: 'Barbell Squat',
    muscles: ['Quadriceps', 'Glutes', 'Hamstrings', 'Core'],
    equipment: 'Barbell',
    instructions: 'Place barbell on upper back. Keep chest up. Lower hips back and down. Drive through heels.',
    gifUrl: 'https://example.com/squat.gif' // Replace with actual URL
  },
  {
    id: '2',
    name: 'Bench Press',
    muscles: ['Chest', 'Triceps', 'Front Delts'],
    equipment: 'Barbell',
    instructions: 'Lie on bench. Grip slightly wider than shoulders. Lower bar to mid-chest. Press up explosively.',
    gifUrl: 'https://example.com/bench.gif'
  },
  {
    id: '3',
    name: 'Deadlift',
    muscles: ['Hamstrings', 'Glutes', 'Lower Back', 'Traps'],
    equipment: 'Barbell',
    instructions: 'Stand mid-foot under bar. Bend at hips. Grip just outside knees. Keep back flat. Drive hips forward.',
    gifUrl: 'https://example.com/deadlift.gif'
  },
  {
    id: '4',
    name: 'Pull Up',
    muscles: ['Lats', 'Biceps', 'Rear Delts'],
    equipment: 'Pull-up Bar',
    instructions: 'Hang with palms away. Pull chest to bar. Lower with control.',
    gifUrl: 'https://example.com/pullup.gif'
  },
  {
    id: '5',
    name: 'Overhead Press',
    muscles: ['Shoulders', 'Triceps', 'Upper Chest'],
    equipment: 'Barbell',
    instructions: 'Rack bar at clavicle. Press overhead. Keep core tight. Don\'t lean back.',
    gifUrl: 'https://example.com/ohp.gif'
  },
  {
    id: '6',
    name: 'Leg Press',
    muscles: ['Quadriceps', 'Glutes', 'Hamstrings'],
    equipment: 'Machine',
    instructions: 'Place feet shoulder-width. Lower until knees at 90°. Press without locking knees.',
    gifUrl: 'https://example.com/legpress.gif'
  },
  {
    id: '7',
    name: 'Dumbbell Row',
    muscles: ['Lats', 'Rhomboids', 'Biceps'],
    equipment: 'Dumbbell',
    instructions: 'One knee on bench. Pull dumbbell to hip. Squeeze back.',
    gifUrl: 'https://example.com/row.gif'
  },
  {
    id: '8',
    name: 'Push Up',
    muscles: ['Chest', 'Triceps', 'Core'],
    equipment: 'Bodyweight',
    instructions: 'Hands shoulder-width. Lower chest to floor. Keep body straight.',
    gifUrl: 'https://example.com/pushup.gif'
  }
];

// Affordable food database for meal recommendations
export const affordableFoods = {
  weight_loss: {
    low: ['Eggs (₹5/egg)', 'Oats (₹30/kg)', 'Bananas (₹40/dozen)', 'Chicken breast (₹200/kg)', 'Dal (₹80/kg)'],
    medium: ['Greek yogurt (₹60/cup)', 'Quinoa (₹250/kg)', 'Sweet potatoes (₹40/kg)', 'Turkey (₹400/kg)'],
    high: ['Protein powder (₹2000/jar)', 'Salmon (₹800/kg)', 'Avocado (₹150/piece)']
  },
  weight_gain: {
    low: ['Peanut butter (₹120/jar)', 'Whole milk (₹60/liter)', 'Rice (₹60/kg)', 'Bananas', 'Eggs'],
    medium: ['Nuts mix (₹300/500g)', 'Cheese (₹250/block)', 'Whole wheat bread (₹40/loaf)'],
    high: ['Mass gainer (₹2500/jar)', 'Steak (₹600/kg)', 'Almond butter (₹500/jar)']
  }
};

// Sample meal plan templates
export const mealPlans = {
  weight_loss_low: {
    breakfast: 'Oats with banana (₹15)',
    lunch: '200g chicken breast + rice + dal (₹60)',
    dinner: '3 egg omelette with vegetables (₹25)',
    snack: '1 apple or orange (₹10)',
    totalDailyCost: '₹110'
  },
  weight_gain_low: {
    breakfast: 'Peanut butter sandwich + whole milk (₹35)',
    lunch: '300g rice + dal + 2 eggs (₹50)',
    dinner: '200g chicken + potatoes (₹55)',
    snack: 'Banana shake with milk (₹20)',
    totalDailyCost: '₹160'
  }
};