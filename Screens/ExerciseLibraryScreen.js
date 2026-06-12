// File: screens/ExerciseLibraryScreen.js
import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TextInput, 
  TouchableOpacity, Modal, Alert 
} from 'react-native';
import { exercisesList } from '../data/exercisesData';
import { saveCustomExercise, getCustomExercises } from '../utils/storage';

export default function ExerciseLibraryScreen() {
  const [search, setSearch] = useState('');
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customMuscles, setCustomMuscles] = useState('');
  const [customEquipment, setCustomEquipment] = useState('');

  const filteredExercises = exercisesList.filter(ex => 
    ex.name.toLowerCase().includes(search.toLowerCase()) ||
    ex.muscles.some(m => m.toLowerCase().includes(search.toLowerCase()))
  );

  const addCustomExercise = async () => {
    if (!customName) {
      Alert.alert('Error', 'Please enter exercise name');
      return;
    }

    const newExercise = {
      id: `custom_${Date.now()}`,
      name: customName,
      muscles: customMuscles.split(',').map(m => m.trim()),
      equipment: customEquipment || 'Unknown',
      instructions: 'Custom exercise - add your own form notes',
      isCustom: true
    };

    await saveCustomExercise(newExercise);
    Alert.alert('Added', `${customName} added to your library`);
    setShowCustomModal(false);
    setCustomName('');
    setCustomMuscles('');
    setCustomEquipment('');
  };

  const renderExerciseItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.exerciseCard}
      onPress={() => setSelectedExercise(item)}
    >
      <Text style={styles.exerciseName}>{item.name}</Text>
      <View style={styles.muscleTags}>
        {item.muscles.slice(0, 2).map((muscle, idx) => (
          <View key={idx} style={styles.muscleTag}>
            <Text style={styles.muscleText}>{muscle}</Text>
          </View>
        ))}
        {item.muscles.length > 2 && (
          <Text style={styles.moreMuscles}>+{item.muscles.length - 2}</Text>
        )}
      </View>
      <Text style={styles.equipment}>⚙️ {item.equipment}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput 
          style={styles.searchBar}
          placeholder="🔍 Search exercises or muscles..."
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity 
          style={styles.customButton}
          onPress={() => setShowCustomModal(true)}
        >
          <Text style={styles.customButtonText}>+ Custom</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredExercises}
        renderItem={renderExerciseItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No exercises found</Text>
          </View>
        }
      />

      <Modal visible={!!selectedExercise} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedExercise?.name}</Text>
            
            <View style={styles.modalSection}>
              <Text style={styles.modalLabel}>🎯 Target Muscles</Text>
              <View style={styles.modalTags}>
                {selectedExercise?.muscles.map((m, idx) => (
                  <View key={idx} style={styles.modalTag}>
                    <Text style={styles.modalTagText}>{m}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.modalLabel}>⚙️ Equipment</Text>
              <Text style={styles.modalText}>{selectedExercise?.equipment}</Text>
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.modalLabel}>📖 How to do it</Text>
              <Text style={styles.modalText}>{selectedExercise?.instructions}</Text>
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.modalLabel}>🎬 Animation</Text>
              <Text style={styles.gifPlaceholder}>
                📱 Animation would play here (GIF/Lottie)
                {"\n\n"}For this demo, the actual animation requires a CDN. 
                {"\n"}In production, you'd add a video or Lottie JSON URL.
              </Text>
            </View>

            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setSelectedExercise(null)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showCustomModal} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>➕ Add Custom Exercise</Text>
            
            <Text style={styles.modalLabel}>Exercise Name *</Text>
            <TextInput 
              style={styles.modalInput}
              placeholder="e.g., Cable Crunch"
              value={customName}
              onChangeText={setCustomName}
            />

            <Text style={styles.modalLabel}>Target Muscles (comma separated)</Text>
            <TextInput 
              style={styles.modalInput}
              placeholder="e.g., Abs, Core"
              value={customMuscles}
              onChangeText={setCustomMuscles}
            />

            <Text style={styles.modalLabel}>Equipment</Text>
            <TextInput 
              style={styles.modalInput}
              placeholder="e.g., Cable machine"
              value={customEquipment}
              onChangeText={setCustomEquipment}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelModalButton]}
                onPress={() => setShowCustomModal(false)}
              >
                <Text style={styles.cancelModalText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveModalButton]}
                onPress={addCustomExercise}
              >
                <Text style={styles.saveModalText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { flexDirection: 'row', padding: 16, gap: 12, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#eee' },
  searchBar: { flex: 1, backgroundColor: '#f0f0f0', borderRadius: 10, padding: 12, fontSize: 16 },
  customButton: { backgroundColor: '#ff6b35', paddingHorizontal: 16, justifyContent: 'center', borderRadius: 10 },
  customButtonText: { color: 'white', fontWeight: 'bold' },
  listContent: { padding: 16 },
  exerciseCard: { backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2 },
  exerciseName: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  muscleTags: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 6 },
  muscleTag: { backgroundColor: '#e8f4f8', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12, marginRight: 6, marginBottom: 4 },
  muscleText: { fontSize: 11, color: '#0066cc' },
  moreMuscles: { fontSize: 11, color: 'gray', alignSelf: 'center' },
  equipment: { fontSize: 12, color: 'gray', marginTop: 4 },
  empty: { alignItems: 'center', padding: 40 },
  emptyText: { fontSize: 16, color: 'gray' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: 'white', borderRadius: 20, padding: 24, width: '90%', maxHeight: '80%' },
  modalTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  modalSection: { marginBottom: 16 },
  modalLabel: { fontSize: 16, fontWeight: '600', marginBottom: 6, color: '#555' },
  modalTags: { flexDirection: 'row', flexWrap: 'wrap' },
  modalTag: { backgroundColor: '#e8f4f8', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 15, marginRight: 6, marginBottom: 4 },
  modalTagText: { fontSize: 12, color: '#0066cc' },
  modalText: { fontSize: 14, color: '#333', lineHeight: 20 },
  gifPlaceholder: { backgroundColor: '#f0f0f0', padding: 16, borderRadius: 10, textAlign: 'center', color: '#666', fontSize: 12, fontStyle: 'italic' },
  closeButton: { backgroundColor: '#ff6b35', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 16 },
  closeButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  modalInput: { backgroundColor: '#f9f9f9', borderRadius: 10, padding: 12, marginBottom: 12, borderWidth: 0.5, borderColor: '#ddd' },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginTop: 12 },
  modalButton: { flex: 1, padding: 12, borderRadius: 10, alignItems: 'center' },
  cancelModalButton: { backgroundColor: '#e0e0e0' },
  saveModalButton: { backgroundColor: '#4caf50' },
  cancelModalText: { color: '#333', fontWeight: 'bold' },
  saveModalText: { color: 'white', fontWeight: 'bold' }
});