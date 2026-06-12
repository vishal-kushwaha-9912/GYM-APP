
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [workouts, setWorkouts] = useState([]);
  const [showWorkoutForm, setShowWorkoutForm] = useState(false);
  const [exercise, setExercise] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    try {
      const saved = await AsyncStorage.getItem('workouts');
      if (saved) setWorkouts(JSON.parse(saved) as Workout[]);
    } catch (error) {
      console.error(error);
    }
  };

  const saveWorkout = async () => {
    if (!exercise || !reps || !weight) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const newWorkout = {
      id: Date.now().toString(),
      exercise,
      reps: parseInt(reps),
      weight: parseFloat(weight),
      date: new Date().toLocaleDateString(),
    };

    const updated = [newWorkout, ...workouts];
    setWorkouts(updated);
    await AsyncStorage.setItem('workouts', JSON.stringify(updated));
    
    setExercise('');
    setReps('');
    setWeight('');
    setShowWorkoutForm(false);
    Alert.alert('Success', 'Workout saved!');
  };

  const deleteWorkout = async (id) => {
    const updated = workouts.filter(w => w.id !== id);
    setWorkouts(updated);
    await AsyncStorage.setItem('workouts', JSON.stringify(updated));
  };

  const getPR = (exerciseName: string) => {
    const pr = workouts
      .filter(w => w.exercise === exerciseName)
      .sort((a, b) => b.weight - a.weight)[0];
    return pr ? pr.weight : 0;
  };

  const uniqueExercises = [...new Set(workouts.map(w => w.exercise))];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>💪 My Gym App</Text>
        <Text style={styles.subtitle}>Track workouts & beat your records</Text>
      </View>

      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => setShowWorkoutForm(true)}
      >
        <Text style={styles.addButtonText}>+ Log New Workout</Text>
      </TouchableOpacity>

      {showWorkoutForm && (
        <View style={styles.form}>
          <Text style={styles.formTitle}>Log Your Set</Text>
          
          <TextInput 
            style={styles.input}
            placeholder="Exercise (e.g., Bench Press)"
            value={exercise}
            onChangeText={setExercise}
          />
          
          <TextInput 
            style={styles.input}
            placeholder="Reps"
            keyboardType="numeric"
            value={reps}
            onChangeText={setReps}
          />
          
          <TextInput 
            style={styles.input}
            placeholder="Weight (kg)"
            keyboardType="numeric"
            value={weight}
            onChangeText={setWeight}
          />
          
          <TouchableOpacity style={styles.saveButton} onPress={saveWorkout}>
            <Text style={styles.saveButtonText}>Save Workout</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.cancelButton} 
            onPress={() => setShowWorkoutForm(false)}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      {uniqueExercises.length > 0 && (
        <View style={styles.prSection}>
          <Text style={styles.sectionTitle}>🏆 Your Personal Records</Text>
          {uniqueExercises.map(ex => (
            <View key={ex} style={styles.prCard}>
              <Text style={styles.prExercise}>{ex}</Text>
              <Text style={styles.prWeight}>{getPR(ex)} kg</Text>
            </View>
          ))}
        </View>
      )}

      {workouts.length > 0 && (
        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>📋 Recent Workouts</Text>
          {workouts.slice(0, 10).map(workout => (
            <View key={workout.id} style={styles.workoutCard}>
              <View style={styles.workoutInfo}>
                <Text style={styles.workoutExercise}>{workout.exercise}</Text>
                <Text style={styles.workoutDetails}>
                  {workout.reps} reps × {workout.weight} kg
                </Text>
                <Text style={styles.workoutDate}>{workout.date}</Text>
              </View>
              <TouchableOpacity 
                onPress={() => deleteWorkout(workout.id)}
                style={styles.deleteButton}
              >
                <Text style={styles.deleteText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {workouts.length === 0 && !showWorkoutForm && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🏋️</Text>
          <Text style={styles.emptyTitle}>No workouts yet</Text>
          <Text style={styles.emptyText}>Tap the button above to log your first workout!</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#ff6b35', padding: 30, paddingTop: 50, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: 'white' },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.9)', marginTop: 5 },
  addButton: { backgroundColor: '#4caf50', margin: 20, padding: 15, borderRadius: 12, alignItems: 'center' },
  addButtonText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
  form: { backgroundColor: 'white', margin: 20, padding: 20, borderRadius: 12, elevation: 3 },
  formTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  input: { backgroundColor: '#f0f0f0', borderRadius: 10, padding: 12, marginBottom: 10, fontSize: 16 },
  saveButton: { backgroundColor: '#ff6b35', padding: 12, borderRadius: 10, alignItems: 'center', marginTop: 5 },
  saveButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  cancelButton: { padding: 10, alignItems: 'center', marginTop: 5 },
  cancelButtonText: { color: 'gray' },
  prSection: { margin: 20, marginTop: 0 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  prCard: { backgroundColor: 'white', borderRadius: 10, padding: 15, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  prExercise: { fontSize: 16, fontWeight: '500' },
  prWeight: { fontSize: 20, fontWeight: 'bold', color: '#ff6b35' },
  historySection: { margin: 20, marginTop: 0 },
  workoutCard: { backgroundColor: 'white', borderRadius: 10, padding: 15, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  workoutInfo: { flex: 1 },
  workoutExercise: { fontSize: 16, fontWeight: 'bold' },
  workoutDetails: { fontSize: 14, color: '#666', marginTop: 3 },
  workoutDate: { fontSize: 11, color: '#999', marginTop: 3 },
  deleteButton: { padding: 8 },
  deleteText: { fontSize: 18 },
  emptyState: { alignItems: 'center', padding: 50 },
  emptyEmoji: { fontSize: 60, marginBottom: 15 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: '#555', marginBottom: 8 },
  emptyText: { fontSize: 14, color: 'gray', textAlign: 'center' },
});
'@ | Out-File -FilePath App.js -Encoding UTF8  '