import { DashboardHeader } from '@/components/DashboardHeader';
import { PostCard } from '@/components/PostCard';
import { ScreenGradient } from '@/components/ScreenGradient';
import { POSTS } from '@/constants/data';
import { useSession } from '@/ctx';
import { supabase } from '@/lib/supabase';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { session } = useSession();
  const [completedChallenges, setCompletedChallenges] = useState<Set<string>>(new Set());
  const [totalCompletedCount, setTotalCompletedCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [profile, setProfile] = useState<any>(null);


  useFocusEffect(
    useCallback(() => {
      if (!session?.user) return;

      const fetchData = async () => {
        try {


          // 2. Fetch All Stats for Tiles
          const { data: postsData, error: postsError } = await supabase
            .from('posts')
            .select('challenge_id, created_at')
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false });

          if (postsData) {
            // Filter for TODAY'S completions only
            const currentDateStr = new Date().toDateString();
            const todaysPosts = postsData.filter(post =>
              new Date(post.created_at).toDateString() === currentDateStr
            );

            const completed = new Set(todaysPosts.map(post => post.challenge_id));
            setCompletedChallenges(completed);

            // Total count still reflects all-time or could be today's count depending on preference.
            // Keeping it as total posts count for now based on variable name 'totalCompletedCount'
            setTotalCompletedCount(postsData.length);

            // Calculate Streak
            const uniqueDays = new Set(postsData.map(p => new Date(p.created_at).toDateString()));
            const sortedDates = Array.from(uniqueDays)
              .map(d => new Date(d))
              .sort((a, b) => a.getTime() - b.getTime());

            let currentStreak = 0;
            const todayStr = new Date().toDateString();
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toDateString();

            const lastPostDate = sortedDates[sortedDates.length - 1];
            if (lastPostDate) {
              const lastPostStr = lastPostDate.toDateString();
              if (lastPostStr === todayStr || lastPostStr === yesterdayStr) {
                currentStreak = 1;
                for (let i = sortedDates.length - 2; i >= 0; i--) {
                  const curr = sortedDates[i];
                  const next = sortedDates[i + 1];
                  const diffTime = Math.abs(next.getTime() - curr.getTime());
                  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
                  if (diffDays === 1) {
                    currentStreak++;
                  } else {
                    break;
                  }
                }
              }
            }
            setStreak(currentStreak);
          }

          // 2. Fetch Profile (for XP/Level)
          // Silent fetch - no "Loading" state to prevent flashing
          const { data: profileData } = await supabase
            .from('profiles')
            .select('full_name, avatar_url, xp')
            .eq('id', session.user.id)
            .single();

          if (profileData) {
            setProfile(profileData);
          }

        } catch (error) {
          console.error('Error fetching dashboard data:', error);
        }
      };

      fetchData();
    }, [session?.user])
  );

  return (
    <ScreenGradient>
      <SafeAreaView style={styles.container} edges={['top']}>
        <FlatList
          style={{ flex: 1 }}
          data={POSTS}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <View style={styles.headerContainer}>
              <DashboardHeader
                user={session?.user}
                profile={profile}
                streak={streak}
                completedCount={totalCompletedCount}
              />




              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Trending Challenges</Text>
              </View>
            </View>
          }
          renderItem={({ item }) => (
            <PostCard
              id={item.id}
              challengeId={item.challengeId}
              username={item.username}
              challengeTitle={item.challengeTitle}
              imageUrl={item.imageUrl}
              timestamp={item.timestamp}
              likes={item.likes}
              caption={item.caption}
              participantsCount={item.participants}
              friendsActivity={item.friendsActivity}
              isCompleted={completedChallenges.has(item.challengeId)}
            />
          )}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </ScreenGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 100, // Extra padding for tab bar
  },
  headerContainer: {
    marginBottom: 8,
  },
  sectionHeader: {
    marginTop: 8,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },

});
