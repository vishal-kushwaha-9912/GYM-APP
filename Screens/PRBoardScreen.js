// File: screens/PRBoardScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Share } from 'react-native';
import { getWorkouts } from '../utils/storage';
import { calculatePRs } from '../utils/prCalculator';

export default function PRBoardScreen() {
  const [prs, setPrs] = useState([]);
  const [filter, setFilter] = useState('all'); // all, recent, heavy

  useEffect(() => {
    loadPRs();
  }, []);

  const loadPRs = async () => {
    const workouts = await getWorkouts();
    const allPRs = calculatePRs(workouts);
    setPrs(allPRs);
  };

  const filteredPRs = () => {
    if (filter === 'recent') {
      return [...prs].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
    }
    if (filter === 'heavy') {
      return prs.slice(0, 5);
    }
    return prs;
  };

  const sharePR = async (pr) => {
    try {
      await Share.share({
        message: `🏆 New Personal Record! 🏆\n${pr.name}: ${pr.maxWeight}kg for ${pr.reps} reps\nAchieved on ${pr.date}\n\nTrack your PRs with GymMate!`,
      });
    } catch (error) {
      console.log('Share failed', error);
    }
  };

  const getMedalEmoji = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return '📊';
  };

  const renderPRCard = ({ item, index }) => (
    <TouchableOpacity style={styles.prCard} onPress={() => sharePR(item)}>
      <View style={styles.prHeader}>
        <Text style={styles.medal}>{getMedalEmoji(index)}</Text>
        <Text style={styles.prName}>{item.name}</Text>
        <TouchableOpacity onPress={() => sharePR(item)} style={styles.shareIcon}>
          <Text style={styles.shareText}>📤</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.prDetails}>
        <Text style={styles.prWeight}>{item.maxWeight} kg</Text>
        <Text style={styles.prReps}>× {item.reps} reps</Text>
      </View>
      <Text style={styles.prDate}>📅 {item.date}</Text>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${Math.min(100, (item.maxWeight / (prs[0]?.maxWeight || 1)) * 100)}%` }]} />
      </View>
    </TouchableOpacity>
  );

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>🏋️</Text>
      <Text style={styles.emptyTitle}>No PRs Yet</Text>
      <Text style={styles.emptyText}>Complete a workout to see your personal records here!</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🏆 Personal Records</Text>
        <Text style={styles.subtitle}>Your all-time best lifts</Text>
      </View>

      <View style={styles.filterRow}>
        <TouchableOpacity 
          style={[styles.filterChip, filter === 'all' && styles.activeFilter]} 
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.activeFilterText]}>All PRs</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterChip, filter === 'heavy' && styles.activeFilter]} 
          onPress={() => setFilter('heavy')}
        >
          <Text style={[styles.filterText, filter === 'heavy' && styles.activeFilterText]}>Top 5 Heaviest</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterChip, filter === 'recent' && styles.activeFilter]} 
          onPress={() => setFilter('recent')}
        >
          <Text style={[styles.filterText, filter === 'recent' && styles.activeFilterText]}>Recent 5</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredPRs()}
        renderItem={renderPRCard}
        keyExtractor={(item, idx) => `${item.name}-${idx}`}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={EmptyState}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#ff6b35', padding: 20, paddingTop: 40, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: 'white' },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  filterRow: { flexDirection: 'row', justifyContent: 'space-around', padding: 16, backgroundColor: 'white', marginHorizontal: 16, marginTop: 16, borderRadius: 12, elevation: 2 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f0f0f0' },
  activeFilter: { backgroundColor: '#ff6b35' },
  filterText: { color: '#666', fontWeight: '500' },
  activeFilterText: { color: 'white' },
  listContent: { padding: 16, paddingBottom: 40 },
  prCard: { backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2 },
  prHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  medal: { fontSize: 24, marginRight: 8 },
  prName: { fontSize: 18, fontWeight: 'bold', flex: 1 },
  shareIcon: { padding: 6 },
  shareText: { fontSize: 20 },
  prDetails: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 8 },
  prWeight: { fontSize: 28, fontWeight: 'bold', color: '#ff6b35', marginRight: 8 },
  prReps: { fontSize: 16, color: 'gray' },
  prDate: { fontSize: 12, color: 'gray', marginBottom: 8 },
  progressBar: { height: 4, backgroundColor: '#e0e0e0', borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#ff6b35', borderRadius: 2 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', padding: 40, marginTop: 40 },
  emptyEmoji: { fontSize: 60, marginBottom: 16 },
  emptyTitle: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  emptyText: { fontSize: 14, color: 'gray', textAlign: 'center' }
});