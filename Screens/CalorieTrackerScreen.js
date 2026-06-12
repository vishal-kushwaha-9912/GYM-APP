// File: screens/CalorieTrackerScreen.js
import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, 
  FlatList, Alert, ScrollView, Modal 
} from 'react-native';
import { getFoods, saveFood } from '../utils/storage';
import { affordableFoods, mealPlans } from '../data/exercisesData';

export default function CalorieTrackerScreen() {
  const [foods, setFoods] = useState([]);
  const [foodName, setFoodName] = useState('');
  const [protein, setProtein] = useState('');
  const [calories, setCalories] = useState('');
  const [showMealModal, setShowMealModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [dailyTotal, setDailyTotal] = useState({ calories: 0, protein: 0 });

  useEffect(() => {
    loadFoods();
  }, []);

  const loadFoods = async () => {
    const allFoods = await getFoods();
    setFoods(allFoods);
    calculateDailyTotal(allFoods);
  };

  const calculateDailyTotal = (foodList) => {
    const today = new Date().toISOString().split('T')[0];
    const todayFoods = foodList.filter(f => f.date === today);
    const totalCal = todayFoods.reduce((sum, f) => sum + (f.calories || 0), 0);
    const totalPro = todayFoods.reduce((sum, f) => sum + (f.protein || 0), 0);
    setDailyTotal({ calories: totalCal, protein: totalPro });
  };

  const addFood = async () => {
    if (!foodName || !calories) {
      Alert.alert('Missing info', 'Please enter food name and calories');
      return;
    }

    const newFood = {
      id: Date.now().toString(),
      name: foodName,
      protein: parseFloat(protein) || 0,
      calories: parseInt(calories),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString()
    };

    const saved = await saveFood(newFood);
    if (saved) {
      setFoodName('');
      setProtein('');
      setCalories('');
      loadFoods();
      Alert.alert('Added', `${foodName} logged!`);
    }
  };

  const removeFoodLocally = (id) => {
    // Note: Full remove requires storage update. For demo, reload after real save
    Alert.alert('Remove', 'Delete feature coming soon');
  };

  const getMealRecommendation = () => {
    if (!selectedGoal || !selectedBudget) return null;
    
    const key = `${selectedGoal}_${selectedBudget}`;
    if (key === 'weight_loss_low') return mealPlans.weight_loss_low;
    if (key === 'weight_gain_low') return mealPlans.weight_gain_low;
    
    // Fallback recommendations
    return {
      breakfast: 'Balanced meal with protein + carbs',
      lunch: 'Lean protein + vegetables',
      dinner: 'Whole foods, avoid processed',
      snack: 'Fruits or nuts',
      totalDailyCost: 'Varies'
    };
  };

  const recommendFoodsList = () => {
    if (!selectedGoal || !selectedBudget) return [];
    return affordableFoods[selectedGoal]?.[selectedBudget] || [];
  };

  const renderFoodItem = ({ item }) => (
    <View style={styles.foodCard}>
      <View style={styles.foodInfo}>
        <Text style={styles.foodName}>{item.name}</Text>
        <Text style={styles.foodTime}>{item.time}</Text>
      </View>
      <View style={styles.foodStats}>
        <Text style={styles.foodProtein}>💪 {item.protein}g</Text>
        <Text style={styles.foodCalories}>🔥 {item.calories} cal</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.totalCard}>
        <Text style={styles.totalTitle}>Today's Total</Text>
        <View style={styles.totalRow}>
          <View style={styles.totalItem}>
            <Text style={styles.totalNumber}>{dailyTotal.calories}</Text>
            <Text style={styles.totalLabel}>Calories</Text>
          </View>
          <View style={styles.totalItem}>
            <Text style={styles.totalNumber}>{dailyTotal.protein}g</Text>
            <Text style={styles.totalLabel}>Protein</Text>
          </View>
        </View>
      </View>

      <View style={styles.inputSection}>
        <Text style={styles.sectionTitle}>Log Food</Text>
        <TextInput 
          style={styles.input}
          placeholder="Food name (e.g., Chicken breast)"
          value={foodName}
          onChangeText={setFoodName}
        />
        <TextInput 
          style={styles.input}
          placeholder="Protein (grams)"
          keyboardType="numeric"
          value={protein}
          onChangeText={setProtein}
        />
        <TextInput 
          style={styles.input}
          placeholder="Calories"
          keyboardType="numeric"
          value={calories}
          onChangeText={setCalories}
        />
        <TouchableOpacity style={styles.addButton} onPress={addFood}>
          <Text style={styles.addButtonText}>+ Add Food</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mealPlanSection}>
        <Text style={styles.sectionTitle}>🍽️ Get Meal Recommendations</Text>
        <TouchableOpacity 
          style={styles.mealPlanButton} 
          onPress={() => setShowMealModal(true)}
        >
          <Text style={styles.mealPlanButtonText}>Create My Meal Plan</Text>
        </TouchableOpacity>
      </View>

      {foods.length > 0 && (
        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Today's Food Log</Text>
          <FlatList
            data={foods.filter(f => f.date === new Date().toISOString().split('T')[0])}
            renderItem={renderFoodItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        </View>
      )}

      <Modal visible={showMealModal} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create Your Meal Plan</Text>
            
            <Text style={styles.modalLabel}>1. Choose your goal</Text>
            <View style={styles.modalRow}>
              <TouchableOpacity 
                style={[styles.optionButton, selectedGoal === 'weight_loss' && styles.optionSelected]}
                onPress={() => setSelectedGoal('weight_loss')}
              >
                <Text style={styles.optionText}>⬇️ Weight Loss</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.optionButton, selectedGoal === 'weight_gain' && styles.optionSelected]}
                onPress={() => setSelectedGoal('weight_gain')}
              >
                <Text style={styles.optionText}>⬆️ Weight Gain</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.modalLabel}>2. Your budget</Text>
            <View style={styles.modalRow}>
              <TouchableOpacity 
                style={[styles.optionButton, selectedBudget === 'low' && styles.optionSelected]}
                onPress={() => setSelectedBudget('low')}
              >
                <Text style={styles.optionText}>💰 Low (₹100-200/day)</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.optionButton, selectedBudget === 'medium' && styles.optionSelected]}
                onPress={() => setSelectedBudget('medium')}
              >
                <Text style={styles.optionText}>💰💰 Medium (₹200-400/day)</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.optionButton, selectedBudget === 'high' && styles.optionSelected]}
                onPress={() => setSelectedBudget('high')}
              >
                <Text style={styles.optionText}>💰💰💰 High (₹400+)</Text>
              </TouchableOpacity>
            </View>

            {selectedGoal && selectedBudget && (
              <View style={styles.recommendationBox}>
                <Text style={styles.recommendTitle}>📋 Your Recommended Plan</Text>
                <Text style={styles.recommendSub}>Affordable foods for you:</Text>
                {recommendFoodsList().map((food, idx) => (
                  <Text key={idx} style={styles.recommendItem}>• {food}</Text>
                ))}
                
                <Text style={styles.recommendSub}>Sample Daily Meal Plan:</Text>
                {getMealRecommendation() && (
                  <View>
                    <Text style={styles.mealItem}>🍳 Breakfast: {getMealRecommendation().breakfast}</Text>
                    <Text style={styles.mealItem}>🍱 Lunch: {getMealRecommendation().lunch}</Text>
                    <Text style={styles.mealItem}>🍲 Dinner: {getMealRecommendation().dinner}</Text>
                    <Text style={styles.mealItem}>🍎 Snack: {getMealRecommendation().snack}</Text>
                    <Text style={styles.costText}>💰 Estimated daily cost: {getMealRecommendation().totalDailyCost}</Text>
                  </View>
                )}
              </View>
            )}

            <TouchableOpacity 
              style={styles.closeModalButton}
              onPress={() => setShowMealModal(false)}
            >
              <Text style={styles.closeModalText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  totalCard: { backgroundColor: '#ff6b35', borderRadius: 16, padding: 20, marginBottom: 20, alignItems: 'center' },
  totalTitle: { fontSize: 16, color: 'rgba(255,255,255,0.9)', marginBottom: 12 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-around', width: '100%' },
  totalItem: { alignItems: 'center' },
  totalNumber: { fontSize: 32, fontWeight: 'bold', color: 'white' },
  totalLabel: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  inputSection: { backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  input: { backgroundColor: '#f9f9f9', borderRadius: 10, padding: 12, marginBottom: 10, borderWidth: 0.5, borderColor: '#ddd' },
  addButton: { backgroundColor: '#4caf50', padding: 14, borderRadius: 10, alignItems: 'center' },
  addButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  mealPlanSection: { marginBottom: 20 },
  mealPlanButton: { backgroundColor: '#2196f3', padding: 16, borderRadius: 12, alignItems: 'center' },
  mealPlanButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  historySection: { backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 20 },
  foodCard: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: '#eee' },
  foodName: { fontSize: 16, fontWeight: '500' },
  foodTime: { fontSize: 11, color: 'gray', marginTop: 2 },
  foodStats: { alignItems: 'flex-end' },
  foodProtein: { fontSize: 13, color: '#4caf50' },
  foodCalories: { fontSize: 13, color: '#ff6b35', marginTop: 2 },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: 'white', borderRadius: 20, padding: 24, width: '90%', maxHeight: '80%' },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  modalLabel: { fontSize: 16, fontWeight: '600', marginTop: 12, marginBottom: 8 },
  modalRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  optionButton: { backgroundColor: '#f0f0f0', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 25, marginRight: 8, marginBottom: 8 },
  optionSelected: { backgroundColor: '#ff6b35' },
  optionText: { color: '#333' },
  recommendationBox: { backgroundColor: '#fff8e7', padding: 16, borderRadius: 12, marginTop: 20, borderLeftWidth: 4, borderLeftColor: '#ff6b35' },
  recommendTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  recommendSub: { fontSize: 14, fontWeight: '600', marginTop: 12, marginBottom: 6 },
  recommendItem: { fontSize: 13, color: '#555', marginLeft: 12, marginVertical: 2 },
  mealItem: { fontSize: 13, marginVertical: 3, marginLeft: 12 },
  costText: { fontSize: 14, fontWeight: 'bold', color: '#ff6b35', marginTop: 10 },
  closeModalButton: { backgroundColor: '#ff6b35', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 24 },
  closeModalText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});