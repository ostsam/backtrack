import { Tabs } from "expo-router";
import React from "react";

// Single-screen tab layout — the tab bar is hidden.

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: "none" },
      }}
    >
      {/* Primary (and only) Posture screen mapped to the root path */}
      <Tabs.Screen name="index" options={{ headerShown: false }} />
    </Tabs>
  );
}
