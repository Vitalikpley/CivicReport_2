import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native";
import { DrawerActions } from "@react-navigation/native";
import HomeStack from "./HomeStack";
import AuthStack from "./AuthStack";

import ProfileScreen from "../screens/ProfileScreen";
import ThemeScreen from "../screens/ThemeScreen";
import LanguageScreen from "../screens/LanguageScreen";
import FilterScreen from "../screens/FilterScreen";
import { useAuth } from "../auth/AuthProvider";

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const { t } = useTranslation();
  const { logout, isAuthenticated } = useAuth();
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      {isAuthenticated && (
        <DrawerItem
          label={t("drawer.logout")}
          icon={({ color, size }) => (
            <Ionicons name="log-out" size={size} color={color} />
          )}
          onPress={() => {
            props.navigation.closeDrawer();
            logout();
          }}
        />
      )}
      {!isAuthenticated && (
        <DrawerItem
          label={t("auth.login")}
          icon={({ color, size }) => (
            <Ionicons name="log-in" size={size} color={color} />
          )}
          onPress={() => {
            props.navigation.closeDrawer();
            props.navigation.navigate("Auth");
          }}
        />
      )}
    </DrawerContentScrollView>
  );
}


export default function DrawerNavigator() {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={({ navigation, route }) => ({
        headerLeft: () => (
          <Pressable
            onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
            style={{ paddingHorizontal: 16 }}
          >
            <Ionicons name="menu" size={24} color={colors.text} />
          </Pressable>
        ),
        drawerIcon: ({ color, size }) => {
          const icons = {
            Home: "home",
            Profile: "person",
            Theme: "moon",
            Language: "language",
            Filter: "filter",
            Auth: "log-in",
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Drawer.Screen
        name="Home"
        component={HomeStack}
        options={{ headerShown: false, title: t("drawer.home") }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: t("drawer.profile") }}
      />
      <Drawer.Screen
        name="Theme"
        component={ThemeScreen}
        options={{ title: t("drawer.themeSelect") }}
      />
      <Drawer.Screen
        name="Language"
        component={LanguageScreen}
        options={{ title: t("drawer.languageSelect") }}
      />
      <Drawer.Screen
        name="Filter"
        component={FilterScreen}
        options={{ title: t("drawer.filter") }}
      />
      <Drawer.Screen
        name="Auth"
        component={AuthStack}
        options={{
          title: t("auth.login"),
          drawerItemStyle: { display: "none" }
        }}
      />
    </Drawer.Navigator>
  );
}


