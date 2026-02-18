import { createStackNavigator } from "@react-navigation/stack";
import BottomTabs from "./BottomTabs";
import ReportDetailScreen from "../screens/ReportDetailScreen";

const Stack = createStackNavigator();

export default function HomeStack() {

    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Tabs"
                component={BottomTabs}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ReportDetail"
                component={ReportDetailScreen}
                options={{ title: "details"}}
            />
        </Stack.Navigator>
    );
}
