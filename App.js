import { useState, useEffect } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { supabase } from "./lib/supabase";

console.log("Supabase URL:", process.env.EXPO_PUBLIC_SUPABASE_URL);

// Initialize Supabase client
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

const CATEGORIES = ["Outdoors", "Creative", "Relax", "Social"];

const SUGGESTIONS = {
  Outdoors: ["Go for a 10-minute walk"],
  Creative: ["Write a short journal entry"],
  Relax: ["Do 5 minutes of deep breathing"],
  Social: ["Text a friend you haven’t talked to recently"],
};

export default function App() {
  const [screen, setScreen] = useState("intro");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [suggestion, setSuggestion] = useState("");
  const [testData, setTestData] = useState(null);

  useEffect(() => {
    // Test connection to Supabase
    async function testSupabaseConnection() {
      try {
        const { data, error } = await supabase.from("prompts").select("*");
        if (error) {
          console.error("Error fetching data from Supabase:", error);
        } else {
          console.log("Data fetched from Supabase:", data);
          setTestData(data);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    }

    testSupabaseConnection();
  }, []);

  function toggleCategory(category) {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  }

  function getSuggestion() {
    const all = selectedCategories.flatMap((c) => SUGGESTIONS[c] || []);
    const randomSuggestion = all[Math.floor(Math.random() * all.length)];
    setSuggestion(randomSuggestion);
    setScreen("home");
  }

  return (
    <View style={styles.container}>
      {screen === "intro" && (
        <>
          <Text style={styles.title}>Sphinx</Text>
          <Text style={styles.text}>
            Sphinx is a tool to help you fight boredom through task suggestions.
            It helps you discover and do activities that gently push you outside
            your comfort zone.
          </Text>
          <Pressable
            style={styles.button}
            onPress={() => setScreen("categories")}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </Pressable>
        </>
      )}

      {screen === "categories" && (
        <>
          <Text style={styles.title}>Choose Categories</Text>
          {CATEGORIES.map((category) => (
            <Pressable
              key={category}
              style={[
                styles.option,
                selectedCategories.includes(category) && styles.selected,
              ]}
              onPress={() => toggleCategory(category)}
            >
              <Text style={styles.optionText}>{category}</Text>
            </Pressable>
          ))}
          <Pressable style={styles.button} onPress={getSuggestion}>
            <Text style={styles.buttonText}>Get Suggestion</Text>
          </Pressable>
        </>
      )}

      {screen === "home" && (
        <>
          <Text style={styles.title}>Your Suggestion</Text>
          <Text style={styles.text}>{suggestion || "No suggestion yet!"}</Text>
          <Pressable
            style={styles.button}
            onPress={() => setScreen("categories")}
          >
            <Text style={styles.buttonText}>Categories</Text>
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={() => setScreen("profile")}
          >
            <Text style={styles.buttonText}>Profile</Text>
          </Pressable>
        </>
      )}

      {screen === "profile" && (
        <>
          <Text style={styles.title}>Profile</Text>
          <Text style={styles.text}>This is a placeholder for profile info.</Text>
          <Pressable style={styles.button} onPress={() => setScreen("home")}>
            <Text style={styles.buttonText}>Back to Home</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#FFFFFF", // White background
  },
  title: {
    fontSize: 28,
    marginBottom: 12,
    color: "#000000", // Black text
    fontWeight: "600",
  },
  text: {
    fontSize: 16,
    marginBottom: 24,
    color: "#000000", // Black text
  },
  option: {
    padding: 12,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: "#B7D1C3", // Sage Green as accent
    borderRadius: 6,
  },
  selected: {
    backgroundColor: "#B7D1C3", // Sage Green for selected
  },
  optionText: {
    color: "#000000", // Black text
  },
  button: {
    marginTop: 24,
    padding: 12,
    backgroundColor: "#BFD7EA", // Dusty Sky Blue as accent
    alignItems: "center",
    borderRadius: 6,
  },
  buttonText: {
    color: "#FFFFFF", // White text for buttons
    fontWeight: "600",
  },
});