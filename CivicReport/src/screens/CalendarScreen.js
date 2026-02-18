import { View, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";
import Calendar from "../calendar/Calendar";

export default function CalendarScreen() {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Calendar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});