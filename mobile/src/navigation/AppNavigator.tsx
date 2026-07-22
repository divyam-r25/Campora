import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { AnnouncementsFeedScreen } from "../screens/announcements/AnnouncementsFeedScreen";
import { NewAnnouncementScreen } from "../screens/announcements/NewAnnouncementScreen";

// This becomes a bottom tab navigator once more modules exist:
// Feed | Events | Groups | Marketplace | Profile
// Keeping it a simple stack for now — Feed is the only tab-worthy screen so far.

export type AppStackParamList = {
  Feed: undefined;
  NewAnnouncement: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

export function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Feed" component={AnnouncementsFeedScreen} />
      <Stack.Screen
        name="NewAnnouncement"
        component={NewAnnouncementScreen}
        options={{ presentation: "modal" }}
      />
    </Stack.Navigator>
  );
}
