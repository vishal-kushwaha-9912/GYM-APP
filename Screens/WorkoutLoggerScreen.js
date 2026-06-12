// File: screens/WorkoutLoggerScreen.js
import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, 
  FlatList, Alert, ScrollView 
} from 'react-native';
import { saveWorkout, getWorkouts } from '../utils/storage';
import { calculatePRs, isNewPR, getPRMessage } from '../utils/prCalculator';
import { exercisesList } from '../data/exercisesData';

export default function WorkoutLoggerScreen() {
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [sets, setSets] = useState([]);
  const [currentSet, setCurrentSet] = useState({ reps: '', weight: '' });
  const [workoutName, setWorkoutName] = useState('');
  const [allWorkouts, setAllWorkouts] = useState([]);
  const [showPRAlert, setShowPRAlert] = useState(null);

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    const workouts = await getWorkouts();
    setAllWorkouts(workouts);
  };

  const addSet = () => {
    if (!currentSet.reps || !currentSet.weight) {
      Alert.alert('Missing info', 'Enter reps and weight');
      return;
    }
    const newSet = {
      setNumber: sets.length + 1,
      reps: parseInt(currentSet.reps),
      weight: parseFloat(currentSet.weight)
    };
    setSets([...sets, newSet]);
    setCurrentSet({ reps: '', weight: '' });
  };

  const removeSet = (index) => {
    const newSets = sets.filter((_, i) => i !== index);
    // renumber sets
    const renumbered = newSets.map((set, idx) => ({ ...set, setNumber: idx + 1 }));
    setSets(renumbered);
  };

  const finishWorkout = async () => {
    if (!selectedExercise) {
      Alert.alert('No exercise', 'Select an exercise first');
      return;
    }
    if (sets.length === 0) {
      Alert.alert('No sets', 'Add at least one set');
      return;
    }

    const currentPRs = calculatePRs(allWorkouts);
    const maxWeightInWorkout = Math.max(...sets.map(s => s.weight));
    const isPR = isNewPR(selectedExercise.name, maxWeightInWorkout, currentPRs);
    
    const oldPR = currentPRs.find(pr => pr.name === selectedExercise.name);
    
    const newWorkout = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString(),
      name: workoutName || `${selectedExercise.name} Workout`,
      exercises: [{
        name: selectedExercise.name,
        sets: sets.length,
        reps: sets[0].reps,
        weight: maxWeightInWorkout,
        allSets: sets
      }]
    };

    const saved = await saveWorkout(newWorkout);
    if (saved) {
      if (isPR) {
        const message = oldPR 
          ? getPRMessage(selectedExercise.name, maxWeightInWorkout, oldPR.maxWeight)
          : `🎉 First PR on ${selectedExercise.name}: ${maxWeightInWorkout}kg!`;
        setShowPRAlert(message);
        setTimeout(() => setShowPRAlert(null), 4000);
      }
      
      Alert.alert('Success', 'Workout saved!');
      setSelectedExercise(null);
      setSets([]);
      setWorkoutName('');
      loadWorkouts();
    } else {
      Alert.alert('Error', 'Could not save workout');
    }
  };

  const renderSetItem = ({ item, index }) => (
    <View style={styles.setRow}>
      <Text style={styles.setNumber}>Set {item.setNumber}</Text>
      <Text style={styles.setDetail}>{item.reps} reps</Text>
      <Text style={styles.setDetail}>{item.weight} kg</Text>
      <TouchableOpacity onPress={() => removeSet(index)} style={styles.removeButton}>
        <Text style={styles.removeText}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {showPRAlert && (
        <View style={styles.prAlert}>
          <Text style={styles.prAlertText}>{showPRAlert}</Text>
        </View>
      )}

      <Text style={styles.label}>Workout Name (optional)</Text>
      <TextInput 
        style={styles.input}
        placeholder="e.g., Upper Body Day"
        value={workoutName}
        onChangeText={setWorkoutName}
      />

      <Text style={styles.label}>Select Exercise</Text>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={exercisesList}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[styles.exerciseChip, selectedExercise?.id === item.id && styles.selectedChip]}
            onPress={() => setSelectedExercise(item)}
          >
            <Text style={[styles.chipText, selectedExercise?.id === item.id && styles.selectedChipText]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
        style={styles.chipList}
      />

      {selectedExercise && (
        <View style={styles.exerciseInfo}>
          <Text style={styles.exerciseName}>📍 {selectedExercise.name}</Text>
          <Text style={styles.muscles}>{selectedExercise.muscles.join(' → ')}</Text>
          <Text style={styles.instructions}>{selectedExercise.instructions}</Text>
        </View>
      )}

      <Text style={styles.label}>Add Set</Text>
      <View style={styles.setInputRow}>
        <TextInput 
          style={[styles.smallInput, styles.repsInput]}
          placeholder="Reps"
          keyboardType="numeric"
          value={currentSet.reps}
          onChangeText={(text) => setCurrentSet({ ...currentSet, reps: text })}
        />
        <TextInput 
          style={[styles.smallInput, styles.weightInput]}
          placeholder="Weight (kg)"
          keyboardType="numeric"
          value={currentSet.weight}
          onChangeText={(text) => setCurrentSet({ ...currentSet, weight: text })}
        />
        <TouchableOpacity style={styles.addButton} onPress={addSet}>
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {sets.length > 0 && (
        <View style={styles.setsContainer}>
          <Text style={styles.sectionTitle}>Sets Logged ({sets.length})</Text>
          <FlatList
            data={sets}
            renderItem={renderSetItem}
            keyExtractor={(_, idx) => idx.toString()}
            scrollEnabled={false}
          />
          <View style={styles.summaryBox}>
            <Text style={styles.summaryText}>
              Total Volume: {sets.reduce((sum, s) => sum + (s.reps * s.weight), 0)} kg
            </Text>
            <Text style={styles.summaryText}>
              Max Weight: {Math.max(...sets.map(s => s.weight))} kg
            </Text>
          </View>
        </View>
      )}

      <TouchableOpacity style={styles.finishButton} onPress={finishWorkout}>
        <Text style={styles.finishButtonText}>✅ Finish & Save Workout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  prAlert: { backgroundColor: '#ff6b35', padding: 12, borderRadius: 10, marginBottom: 16, alignItems: 'center' },
  prAlertText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  label: { fontSize: 16, fontWeight: '600', marginTop: 16, marginBottom: 8 },
  input: { backgroundColor: 'white', borderRadius: 10, padding: 12, fontSize: 16 },
  chipList: { maxHeight: 50, marginBottom: 8 },
  exerciseChip: { backgroundColor: '#e0e0e0', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8 },
  selectedChip: { backgroundColor: '#ff6b35' },
  chipText: { color: '#333' },
  selectedChipText: { color: 'white' },
  exerciseInfo: { backgroundColor: 'white', borderRadius: 10, padding: 12, marginVertical: 12 },
  exerciseName: { fontSize: 18, fontWeight: 'bold' },
  muscles: { fontSize: 12, color: 'gray', marginVertical: 4 },
  instructions: { fontSize: 13, color: '#444', marginTop: 4 },
  setInputRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  smallInput: { backgroundColor: 'white', borderRadius: 10, padding: 12, fontSize: 16 },
  repsInput: { flex: 1 },
  weightInput: { flex: 1 },
  addButton: { backgroundColor: '#4caf50', padding: 12, borderRadius: 10, alignItems: 'center', flex: 0.5 },
  addButtonText: { color: 'white', fontWeight: 'bold' },
  setsContainer: { marginTop: 16, backgroundColor: 'white', borderRadius: 10, padding: 12 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  setRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 0.5, borderBottomColor: '#ddd' },
  setNumber: { fontWeight: 'bold', width: 60 },
  setDetail: { fontSize: 14, width: 80 },
  removeButton: { backgroundColor: '#ff4444', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  removeText: { color: 'white', fontWeight: 'bold' },
  summaryBox: { marginTop: 12, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#ddd' },
  summaryText: { fontSize: 14, fontWeight: '500', marginVertical: 2 },
  finishButton: { backgroundColor: '#ff6b35', padding: 16, borderRadius: 12, alignItems: 'center', marginVertical: 24 },
  finishButtonText: { color: 'white', fontWeight: 'bold', fontSize: 18 }
});