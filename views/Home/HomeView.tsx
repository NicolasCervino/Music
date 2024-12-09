import { View, Text } from "react-native";

// Simple view components
export default function HomeView() {
  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <Text style={{ color: 'white', textAlign: 'center' }}>Home Content</Text>
    </View>
  );
}