import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import { Home, Trophy, User, Users } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { HapticTab } from '@/components/haptic-tab';
import { useColorScheme } from '@/hooks/use-color-scheme';

const AnimatedIcon = ({ focused, icon: IconComponent, color, size = 24 }: { focused: boolean, icon: any, color: string, size?: number }) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withSpring(focused ? 1.1 : 1, { mass: 0.5 });
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    shadowColor: focused ? '#ffffff' : 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: focused ? 0.8 : 0,
    shadowRadius: focused ? 12 : 0,
    elevation: focused ? 10 : 0,
  }));

  return (
    <Animated.View style={animatedStyle}>
      <IconComponent size={size} color={focused ? '#fff' : 'rgba(255,255,255,0.4)'} />
    </Animated.View>
  );
};

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.4)',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontWeight: '600',
          fontSize: 10,
          marginTop: 4,
        },
        tabBarStyle: {
          backgroundColor: Platform.OS === 'ios' ? 'transparent' : '#000',
          borderTopWidth: 1,
          borderTopColor: 'rgba(255,255,255,0.05)',
          elevation: 0,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 85,
          paddingTop: 10,
        },
        tabBarBackground: () => (
          Platform.OS === 'ios' ? (
            <BlurView intensity={90} tint="dark" style={{ ...StyleSheet.absoluteFillObject }} />
          ) : (
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.9)' }} />
          )
        ),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused, color }) => <AnimatedIcon focused={focused} icon={Home} color={color} />,
        }}
      />
      <Tabs.Screen
        name="friends"
        options={{
          title: 'Social',
          tabBarIcon: ({ focused, color }) => <AnimatedIcon focused={focused} icon={Users} color={color} />,
          href: null, // Temporarily hidden
        }}
      />
      <Tabs.Screen
        name="challenges"
        options={{
          title: 'Challenges',
          tabBarIcon: ({ focused, color }) => <AnimatedIcon focused={focused} icon={Trophy} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused, color }) => <AnimatedIcon focused={focused} icon={User} color={color} />,
        }}
      />
    </Tabs>
  );
}
