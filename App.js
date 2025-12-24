import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from "react-native";

console.log("Supabase URL:", process.env.EXPO_PUBLIC_SUPABASE_URL);

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

  function toggleCategory(category) {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  }

  function getSuggestion() {
    const all = selectedCategories.flatMap(
      (c) => SUGGESTIONS[c] || []
    );
    return all[Math.floor(Math.random() * all.length)];
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
            <Text>Get Started</Text>
          </Pressable>
        </>
      )}


      {screen === "categories" && (
        <>
          <Text style={styles.title}>Choose categories</Text>

          {CATEGORIES.map((cat) => (
            <Pressable
              key={cat}
              style={[
                styles.option,
                selectedCategories.includes(cat) && styles.selected,
              ]}
              onPress={() => toggleCategory(cat)}
            >
              <Text>{cat}</Text>
            </Pressable>
          ))}

          <Pressable
            style={[
              styles.button,
              selectedCategories.length === 0 && styles.disabled,
            ]}
            disabled={selectedCategories.length === 0}
            onPress={() => setScreen("home")}
          >
            <Text>Continue</Text>
          </Pressable>
        </>
      )}

      {screen === "home" && (
        <>
          <Text style={styles.title}>Your suggestion</Text>
          <Text style={styles.text}>{getSuggestion()}</Text>

          <Pressable
            style={styles.button}
            onPress={() => setScreen("categories")}
          >
            <Text>Change categories</Text>
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
  },
  title: {
    fontSize: 28,
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    marginBottom: 24,
  },
  option: {
    padding: 12,
    marginVertical: 6,
    borderWidth: 1,
    borderRadius: 6,
  },
  selected: {
    backgroundColor: "#ddd",
  },
  button: {
    marginTop: 24,
    padding: 12,
    backgroundColor: "#eee",
    alignItems: "center",
    borderRadius: 6,
  },
  disabled: {
    opacity: 0.5,
  },
});
