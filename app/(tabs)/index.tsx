import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
  AppState,
  ScrollView,
  Text,
  TouchableOpacity,
  Vibration,
  View
} from 'react-native';
import Animated, {
  FadeInDown
} from 'react-native-reanimated';

export default function HomeScreen() {

  const workouts = [
    ["Squats", "Pushups", "Plank"],
    ["Lunges", "Wall Sit", "Leg Raises"],
    ["Glute Bridge", "Mountain Climbers", "Crunches"]
  ];

  const allExercises = [
    "Squats",
    "Pushups",
    "Plank",
    "Burpees",
    "Jumping Jacks",
    "Mountain Climbers",
    "Lunges",
    "Crunches",
    "Wall Sit",
    "High Knees",
    "Leg Raises",
    "Glute Bridge"
  ];

  const [todayWorkout, setTodayWorkout] = useState<string[]>([]);
  const [streak, setStreak] = useState(0);
  const [diet, setDiet] = useState("");
  const [mood, setMood] = useState("normal");
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [strictMode, setStrictMode] = useState(false);
  const [workoutGenerated, setWorkoutGenerated] = useState(false);

  // TIMER
  useEffect(() => {

    let timer: ReturnType<typeof setInterval>;

    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }

    if (timeLeft <= 0 && isRunning) {
      setTimeLeft(0);
      setIsRunning(false);
      setStrictMode(false);
    }

    return () => clearInterval(timer);

  }, [isRunning, timeLeft]);

  // LEAVE DETECTION
  useEffect(() => {

    const subscription =
      AppState.addEventListener("change", async (state) => {

        if (strictMode && state !== "active") {

          setIsRunning(false);
          setStrictMode(false);
          setTimeLeft(0);
          setStreak(0);

          try {
            await AsyncStorage.setItem('streak', '0');
          } catch (e) {
            console.log("Reset error");
          }

          alert("🚫 You left the workout! Streak reset.");
        }
      });

    return () => subscription.remove();

  }, [strictMode]);

  // LOAD STREAK
  useEffect(() => {

    const loadStreak = async () => {

      try {

        const saved =
          await AsyncStorage.getItem('streak');

        if (saved !== null) {
          setStreak(parseInt(saved));
        }

      } catch (e) {
        console.log("Load error");
      }
    };

    loadStreak();

  }, []);

  // GENERATE WORKOUT
  const generateWorkout = () => {

    const random =
      workouts[Math.floor(Math.random() * workouts.length)];

    setTodayWorkout(random);

    setWorkoutGenerated(true);

    if (mood === "lazy") {

      setTimeLeft(30);

      setDiet(
        "🥤 Light Diet: Ragi malt + fruits"
      );

    } else if (mood === "normal") {

      setTimeLeft(60);

      setDiet(
        "🍽️ Balanced Diet: Oats, rice, veggies"
      );

    } else {

      setTimeLeft(90);

      setDiet(
        "💪 High Energy Diet: Full meals + protein"
      );
    }
  };

  // SWAP SINGLE EXERCISE
  const swapExercise = (index: number) => {

    const randomExercise =
      allExercises[
        Math.floor(Math.random() * allExercises.length)
      ];

    const updatedWorkout = [...todayWorkout];

    updatedWorkout[index] = randomExercise;

    setTodayWorkout(updatedWorkout);
  };

  // COMPLETE WORKOUT
  const completeWorkout = async () => {

    const newStreak = streak + 1;

    setStreak(newStreak);

    try {

      await AsyncStorage.setItem(
        'streak',
        newStreak.toString()
      );

      const savedWorkouts =
        await AsyncStorage.getItem(
          'completedWorkouts'
        );

      let completed = savedWorkouts
        ? parseInt(savedWorkouts)
        : 0;

      completed += 1;

      await AsyncStorage.setItem(
        'completedWorkouts',
        completed.toString()
      );

      const calories = completed * 50;

      await AsyncStorage.setItem(
        'calories',
        calories.toString()
      );

      setWorkoutGenerated(false);

    } catch (e) {
      console.log("Save error");
    }
  };

  // STRICT MODE SCREEN
  if (strictMode) {

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#000',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20
        }}
      >

        <Text
          style={{
            color: '#ff3b3b',
            fontSize: 32,
            fontWeight: 'bold',
            marginBottom: 20
          }}
        >
          🚫 NO ESCAPE
        </Text>

        <Text
          style={{
            color: 'white',
            marginBottom: 20
          }}
        >
          Finish your workout. No excuses.
        </Text>

        {todayWorkout.map((item, index) => (
          <Text
            key={index}
            style={{
              color: 'white',
              fontSize: 18,
              marginBottom: 10
            }}
          >
            🔹 {item}
          </Text>
        ))}

        <Text
          style={{
            color: '#ff3b3b',
            fontSize: 70,
            fontWeight: 'bold',
            marginTop: 30
          }}
        >
          {timeLeft}s
        </Text>

        <Text
          style={{
            color: '#ff3b3b',
            marginTop: 20
          }}
        >
          Leaving = Streak Reset 💀
        </Text>

      </View>
    );
  }

  // NORMAL SCREEN
  return (

    <ScrollView
      style={{
        flex: 1,
        backgroundColor: '#0f0f0f'
      }}
      contentContainerStyle={{
        padding: 25,
        paddingTop: 70,
        alignItems: 'center'
      }}
    >

      {/* TITLE */}
      <Text
        style={{
          color: 'white',
          fontSize: 34,
          fontWeight: 'bold',
          marginBottom: 10
        }}
      >
        💪 Gym Coach AI
      </Text>

      <Text
        style={{
          color: '#888',
          marginBottom: 30
        }}
      >
        Train hard. Stay disciplined.
      </Text>

      {/* MOOD CARD */}
      <View
        style={{
          width: '100%',
          backgroundColor: '#1a1a1a',
          borderRadius: 20,
          padding: 20,
          marginBottom: 20
        }}
      >

        <Text
          style={{
            color: 'white',
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 15
          }}
        >
          Select Mood
        </Text>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}
        >

          <TouchableOpacity
            onPress={() => setMood("lazy")}
            style={{
              backgroundColor:
                mood === "lazy"
                  ? '#ff8800'
                  : '#333',
              padding: 12,
              borderRadius: 12
            }}
          >
            <Text style={{ color: 'white' }}>
              😴 Lazy
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setMood("normal")}
            style={{
              backgroundColor:
                mood === "normal"
                  ? '#00b894'
                  : '#333',
              padding: 12,
              borderRadius: 12
            }}
          >
            <Text style={{ color: 'white' }}>
              🙂 Normal
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setMood("energetic")}
            style={{
              backgroundColor:
                mood === "energetic"
                  ? '#ff3b3b'
                  : '#333',
              padding: 12,
              borderRadius: 12
            }}
          >
            <Text style={{ color: 'white' }}>
              🔥 Energy
            </Text>
          </TouchableOpacity>

        </View>
      </View>

      {/* GENERATE BUTTON */}
      <TouchableOpacity
        onPress={generateWorkout}
        style={{
          width: '100%',
          backgroundColor: '#222',
          padding: 18,
          borderRadius: 18,
          alignItems: 'center',
          marginBottom: 15
        }}
      >
        <Text
          style={{
            color: 'white',
            fontSize: 16,
            fontWeight: 'bold'
          }}
        >
          Generate Workout
        </Text>
      </TouchableOpacity>

      {/* START BUTTON */}
      <TouchableOpacity
        onPress={() => {
          Vibration.vibrate(100);
          setIsRunning(true);
          setStrictMode(true);
        }}
        style={{
          width: '100%',
          backgroundColor: '#ff3b3b',
          padding: 20,
          borderRadius: 18,
          alignItems: 'center',
          marginBottom: 25
        }}
      >
        <Text
          style={{
            color: 'white',
            fontSize: 18,
            fontWeight: 'bold'
          }}
        >
          START WORKOUT ⏱️
        </Text>
      </TouchableOpacity>

      {/* WORKOUT CARD */}
       <Animated.View
        entering={FadeInDown.duration(600)}
        style={{
        width: '100%',
          backgroundColor: '#1a1a1a',
          borderRadius: 20,
          padding: 20,
          marginBottom: 20
        }}
      >

        <Text
          style={{
            color: 'white',
            fontSize: 20,
            fontWeight: 'bold',
            marginBottom: 15
          }}
        >
          Today's Workout
        </Text>

      {todayWorkout.map((item, index) => (
  <Animated.View
    entering={FadeInDown.delay(index * 200).duration(600)}
    key={index}
    style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12
    }}
  >

    <Text
      style={{
        color: 'white',
        fontSize: 17
      }}
    >
      🔹 {item}
    </Text>

    <TouchableOpacity
      onPress={() => swapExercise(index)}
      style={{
        backgroundColor: '#333',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10
      }}
    >
      <Text style={{ color: 'white' }}>
        🔄 Swap
      </Text>
    </TouchableOpacity>

  </Animated.View>
))}

        {diet !== "" && (
          <Text
            style={{
              color: '#ccc',
              marginTop: 15,
              lineHeight: 22
            }}
          >
            {diet}
          </Text>
        )}

      </Animated.View>

      {/* TIMER */}
      {timeLeft > 0 && (
        <View
          style={{
            width: '100%',
            backgroundColor: '#1a1a1a',
            borderRadius: 20,
            padding: 20,
            alignItems: 'center',
            marginBottom: 20
          }}
        >
          <Text
            style={{
              color: '#ff3b3b',
              fontSize: 45,
              fontWeight: 'bold'
            }}
          >
            {timeLeft}s
          </Text>
        </View>
      )}

      {/* COMPLETE BUTTON */}
      <TouchableOpacity
        onPress={completeWorkout}
        disabled={isRunning || !workoutGenerated}
        style={{
          width: '100%',
          backgroundColor:
            isRunning || !workoutGenerated
              ? '#555'
              : '#00b894',
          padding: 18,
          borderRadius: 18,
          alignItems: 'center',
          marginBottom: 20
        }}
      >
        <Text
          style={{
            color: 'white',
            fontWeight: 'bold',
            fontSize: 16
          }}
        >
          {!workoutGenerated
            ? "Generate workout first"
            : isRunning
            ? "Complete after timer ⏳"
            : "Mark Workout Done ✅"}
        </Text>
      </TouchableOpacity>

      {/* STREAK */}
      <View
        style={{
          width: '100%',
          backgroundColor: '#1a1a1a',
          borderRadius: 20,
          padding: 25,
          alignItems: 'center',
          marginBottom: 40
        }}
      >
        <Text
          style={{
            color: '#ffcc00',
            fontSize: 20,
            fontWeight: 'bold'
          }}
        >
          🔥 {streak} Day Streak
        </Text>
      </View>

    </ScrollView>
  );
}