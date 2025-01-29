import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./screens/HomeScreen";
import SearchScreen from "./screens/SearchScreen";
import ProfileScreen from "./screens/ProfileScreen";
import { Ionicons } from "@expo/vector-icons";  //imports the home, search, and profile icons for bottom navigator


const Tab = createBottomTabNavigator();

export default function TabNavigator(){
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({  //to customize the tab
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if(route.name === "Home") iconName = "home";
          else if (route.name === "Search") iconName = "search";
          else if (route.name === "Profile") iconName = "person";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: { backgroundColor: "#1e1e1e", paddingBottom: 5},
        headerShown: false,
      })}
    > 
      <Tab.Screen name="Home" component={HomeScreen} />   
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>  //routes to different screens when clicked
  );
}
