
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useState } from 'react';

import {
  Alert,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function AddTaskScreen() {
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setDescription] = useState('');

  const saveTask = async () => {
    if (!taskName.trim() || !taskDescription.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      // 1. Fetch existing tasks
      const existingTasks = await AsyncStorage.getItem('tasks');

      let tasksArray = existingTasks
        ? JSON.parse(existingTasks)
        : [];

      // 2. Add the new task
      const newTask = {
        id: Date.now().toString(),
        taskName,
        taskDescription,
      };

      tasksArray.push(newTask);

      // 3. Save tasks to AsyncStorage
      await AsyncStorage.setItem(
        'tasks',
        JSON.stringify(tasksArray)
      );

      // 4. Trigger local notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Task Saved Successfully!',
          body: `Don't forget to complete your ${taskName}.`,
          sound: true,
        },
        trigger: null,
      });

      // 5. Navigate back to dashboard
      Alert.alert('Success', 'Task saved successfully!');
      router.back();

    } catch (error) {
      console.error('Failed to save task', error);
      Alert.alert('Error', 'Failed to save task');
    }
  };

  return (
    <ImageBackground
      source={require('../assets/task-banner.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>

        <Text style={styles.heading}>Add New Task</Text>

        {/* Task Name */}
        <Text style={styles.label}>Task Name</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter task name"
          value={taskName}
          onChangeText={setTaskName}
        />

        {/* Task Description */}
        <Text style={styles.label}>Task Description</Text>

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter task description"
          value={taskDescription}
          onChangeText={setDescription}
          multiline={true}
          numberOfLines={4}
        />

        {/* Save Task Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={saveTask}
        >
          <Text style={styles.buttonText}>Save Task</Text>
        </TouchableOpacity>

      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

  container: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.88)',
    padding: 20,
    justifyContent: 'center',
  },

  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#222',
  },

  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },

  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },

  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },

  button: {
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
