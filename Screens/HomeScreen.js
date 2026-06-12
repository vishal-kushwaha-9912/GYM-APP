// File: screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { getWorkouts, getFoods, clearAllData } from '../utils/storage';
import { calculatePRs } from '../utils/prCalculator';

export default function HomeScreen({ navigation }) {
  const [totalWorkouts, setTotalWorkouts] = useState(0);
  const [totalPRs, setTotalPRs] = useState(0);
  const [totalCalories, setTotalCalories] = useState(0);
  const [lastWorkout, setLastWorkout] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const workouts = await getWorkouts();
    const foods = await getFoods();
    const prs = calculatePRs(workouts);
    
    setTotalWorkouts(workouts.length);
    setTotalPRs(prs.length);
    
    const todayCalories = foods
      .filter(f => f.date === new Date().toISOString().split('T')[0])
      .reduce((sum, f) => sum + (f.calories || 0), 0);
    setTotalCalories(todayCalories);
    
    if (workouts.length > 0) {
      setLastWorkout(workouts[0]);
    }
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will delete all workouts, PRs, and food logs. Cannot undo.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: async () => {
            await clearAllData();
            loadStats();
            Alert.alert('Done', 'All data cleared');
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🏋️ My Gym Journey</Text>
        <TouchableOpacity onPress={handleClearData} style={styles.clearButton}>
          <Text style={styles.clearText}>Clear Data</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{totalWorkouts}</Text>
          <Text style={styles.statLabel}>Total Workouts</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{totalPRs}</Text>
          <Text style={styles.statLabel}>Personal Records</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{totalCalories}</Text>
          <Text style={styles.statLabel}>Calories Today</Text>
        </View>
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionRow}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Workout')}
          >
            <Text style={styles.actionText}>📝 Log Workout</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Calories')}
          >
            <Text style={styles.actionText}>🥗 Add Meal</Text>
          </TouchableOpacity>
        </View>
      </View>

      {lastWorkout && (
        <View style={styles.lastWorkout}>
          <Text style={styles.sectionTitle}>Last Workout</Text>
          <Text style={styles.lastWorkoutDate}>{lastWorkout.date}</Text>
          {lastWorkout.exercises?.slice(0, 3).map((ex, idx) => (
            <Text key={idx} style={styles.lastWorkoutText}>
              {ex.name}: {ex.sets}×{ex.reps} @ {ex.weight}kg
            </Text>
          ))}
          {lastWorkout.exercises?.length > 3 && (
            <Text style={styles.moreText}>+{lastWorkout.exercises.length - 3} more</Text>
          )}
        </View>
      )}

      <View style={styles.tipBox}>
        <Text style={styles.tipTitle}>💡 Daily Tip</Text>
        <Text style={styles.tipText}>
          Consistency beats intensity. Showing up 3x per week is better than going hard once and quitting.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#ff6b35' },
  clearButton: { backgroundColor: '#ddd', padding: 8, borderRadius: 8 },
  clearText: { color: 'red', fontSize: 12 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  statCard: { backgroundColor: 'white', borderRadius: 12, padding: 16, flex: 0.32, alignItems: 'center', elevation: 2 },
  statNumber: { fontSize: 28, fontWeight: 'bold', color: '#ff6b35' },
  statLabel: { fontSize: 12, color: 'gray', marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  quickActions: { marginBottom: 24 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between' },
  actionButton: { backgroundColor: '#ff6b35', padding: 14, borderRadius: 10, flex: 0.48, alignItems: 'center' },
  actionText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  lastWorkout: { backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 24 },
  lastWorkoutDate: { fontSize: 14, color: 'gray', marginBottom: 8 },
  lastWorkoutText: { fontSize: 14, marginVertical: 2 },
  moreText: { fontSize: 12, color: '#ff6b35', marginTop: 4 },
  tipBox: { backgroundColor: '#fff8e7', borderRadius: 12, padding: 16, borderLeftWidth: 4, borderLeftColor: '#ff6b35' },
  tipTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 6 },
  tipText: { fontSize: 14, color: '#555' }
});