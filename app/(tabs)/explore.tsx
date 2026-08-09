import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

export default function ExploreScreen() {

  const isFocused = useIsFocused();

  const [streak, setStreak] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [calories, setCalories] = useState(0);

  const motivationQuotes = [
    "Discipline beats motivation.",
    "No pain. No gain.",
    "Your future self will thank you.",
    "Consistency creates results."
  ];

  const randomQuote =
    motivationQuotes[Math.floor(Math.random() * motivationQuotes.length)];

  // LOAD REAL DATA
  useEffect(() => {

    const loadData = async () => {
      try {

        const savedStreak =
          await AsyncStorage.getItem('streak');

        const savedCompleted =
          await AsyncStorage.getItem('completedWorkouts');

        const savedCalories =
          await AsyncStorage.getItem('calories');

        if (savedStreak) {
          setStreak(parseInt(savedStreak));
        }

        if (savedCompleted) {
          setCompleted(parseInt(savedCompleted));
        }

        if (savedCalories) {
          setCalories(parseInt(savedCalories));
        }

      } catch (e) {
        console.log("Load error");
      }
    };

    loadData();

  }, [isFocused]);

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: '#0f0f0f'
      }}
      contentContainerStyle={{
        padding: 25,
        paddingTop: 70
      }}
    >

      {/* TITLE */}
      <Text style={{
        color: 'white',
        fontSize: 34,
        fontWeight: 'bold',
        marginBottom: 10
      }}>
        📊 Progress
      </Text>

      <Text style={{
        color: '#888',
        marginBottom: 30
      }}>
        Your fitness journey
      </Text>

      {/* STREAK CARD */}
      <View style={{
        backgroundColor: '#1a1a1a',
        borderRadius: 20,
        padding: 25,
        marginBottom: 20,
        alignItems: 'center'
      }}>
        <Text style={{
          color: '#ffcc00',
          fontSize: 42,
          fontWeight: 'bold'
        }}>
          🔥 {streak}
        </Text>

        <Text style={{
          color: 'white',
          marginTop: 10,
          fontSize: 18
        }}>
          Day Streak
        </Text>
      </View>

      {/* WORKOUT STATS */}
      <View style={{
        backgroundColor: '#1a1a1a',
        borderRadius: 20,
        padding: 25,
        marginBottom: 20
      }}>
        <Text style={{
          color: 'white',
          fontSize: 22,
          fontWeight: 'bold',
          marginBottom: 15
        }}>
          🏋️ Workout Stats
        </Text>

        <Text style={{
          color: '#ccc',
          fontSize: 17,
          marginBottom: 10
        }}>
          ✅ Workouts Completed: {completed}
        </Text>

        <Text style={{
          color: '#ccc',
          fontSize: 17,
          marginBottom: 10
        }}>
          🔥 Calories Burned: {calories} kcal
        </Text>

        <Text style={{
          color: '#ccc',
          fontSize: 17
        }}>
          ⏱️ Total Training Time: {completed * 15} mins
        </Text>
      </View>

      {/* MOTIVATION */}
      <View style={{
        backgroundColor: '#ff3b3b',
        borderRadius: 20,
        padding: 25,
        marginBottom: 20
      }}>
        <Text style={{
          color: 'white',
          fontSize: 22,
          fontWeight: 'bold',
          marginBottom: 15
        }}>
          🧠 Motivation
        </Text>

        <Text style={{
          color: 'white',
          fontSize: 18,
          lineHeight: 28
        }}>
          "{randomQuote}"
        </Text>
      </View>

      {/* ACHIEVEMENTS */}
      <View style={{
        backgroundColor: '#1a1a1a',
        borderRadius: 20,
        padding: 25,
        marginBottom: 40
      }}>
        <Text style={{
          color: 'white',
          fontSize: 22,
          fontWeight: 'bold',
          marginBottom: 15
        }}>
          🏆 Achievements
        </Text>

        <Text style={{
          color: '#00b894',
          fontSize: 17,
          marginBottom: 10
        }}>
          ✔ First Workout Completed
        </Text>

        <Text style={{
          color: '#00b894',
          fontSize: 17,
          marginBottom: 10
        }}>
          ✔ 7 Day Streak
        </Text>

        <Text style={{
          color: '#888',
          fontSize: 17
        }}>
          🔒 30 Day Beast Mode
        </Text>
      </View>

    </ScrollView>
  );
}