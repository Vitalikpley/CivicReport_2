import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";

import CalendarScreen from "../screens/CalendarScreen";
import MapScreen from "../screens/MapScreen";
import NewViolationScreen from "../screens/CreateViolationScreen";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  return (
    <Tab.Navigator
      screenOptions={({ navigation, route }) => ({
        headerTitleAlign: "center",
        headerLeft: () => (
          <Ionicons
            name="menu"
            size={24}
            color={colors.text}
            style={{ marginLeft: 16 }}
            onPress={() => navigation.getParent()?.openDrawer()}
          />
        ),
        tabBarIcon: ({ focused, color, size }) => {
          const icons = {
            Calendar: focused ? "calendar" : "calendar-outline",
            Map: focused ? "map" : "map-outline",
            New: focused ? "add-circle" : "add-circle-outline",
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{ tabBarLabel: t("tabs.calendar"), title: t("screens.calendarTitle") }}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{ tabBarLabel: t("tabs.map"), title: t("screens.mapTitle") }}
      />
      <Tab.Screen
        name="New"
        component={NewViolationScreen}
        options={{ tabBarLabel: t("tabs.new"), title: t("screens.newTitle") }}
      />
    </Tab.Navigator>
  );
}
