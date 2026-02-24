import { ChallengeGridItem } from '@/components/ChallengeGridItem';
import { ScreenGradient } from '@/components/ScreenGradient';
import { CHALLENGES, FOCUS_RECOMMENDATIONS } from '@/constants/data';
import { Colors } from '@/constants/theme';
import { useSession } from '@/ctx';

import { useFriends } from '@/context/FriendsContext';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useFocusEffect, useRouter } from 'expo-router';
import { Search, Users } from 'lucide-react-native';
import { useCallback, useRef, useState } from 'react';
import { Dimensions, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32; // Full width minus padding

import { FriendActivityCard } from '@/components/FriendActivityCard';


export default function ChallengesScreen() {
  const router = useRouter();
  const { session } = useSession();
  const { friends, friendsActivity, pendingIncoming, refresh } = useFriends();
  // activeIndex restored for carousel
  const [activeIndex, setActiveIndex] = useState(0);

  // Personalization Logic
  const userFocus = session?.user?.user_metadata?.onboarding_data?.focus;
  const recommendedIds = userFocus ? FOCUS_RECOMMENDATIONS[userFocus] : [];
  const recommendedChallenges = CHALLENGES.filter(c => recommendedIds?.includes(c.id));

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [])
  );

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50
  }).current;

  // Filter challenges where friends are participating
  const friendsChallenges = CHALLENGES.filter(c => c.friendsParticipants && c.friendsParticipants.length > 0);

  // Show ALL daily challenges
  const dailyChallenges = CHALLENGES.filter(c => c.category === 'Daily');

  return (
    <ScreenGradient>
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Challenges</Text>
            <Text style={styles.headerSubtitle}>Push your limits today.</Text>
          </View>

          {/* Personalized "Your Plan" Section */}
          {recommendedChallenges.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Your Plan: <Text style={{ color: Colors.dark.primary }}>{userFocus}</Text></Text>
              <Text style={styles.sectionSubtitle}>Curated for your goals.</Text>
              <View style={styles.gridContainer}>
                {recommendedChallenges.map((challenge) => (
                  <Link key={challenge.id} href={`/challenge/${challenge.id}`} asChild>
                    <TouchableOpacity activeOpacity={0.8}>
                      <ChallengeGridItem
                        title={challenge.title}
                        subtitle={challenge.subtitle}
                        image={challenge.image}
                        friendsParticipants={challenge.friendsParticipants}
                        xp={challenge.xp}
                      />
                    </TouchableOpacity>
                  </Link>
                ))}
              </View>
            </View>
          )}

          <View style={styles.section}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <Text style={styles.sectionTitle}>Daily Challenges</Text>
            </View>
            <View>
              <FlatList
                data={dailyChallenges}
                keyExtractor={(item) => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                snapToInterval={CARD_WIDTH + 16} // Card width + margin
                decelerationRate="fast"
                contentContainerStyle={{ paddingHorizontal: 16 }} // Add padding to start/end
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                renderItem={({ item }) => (
                  <Link href={`/challenge/${item.id}`} asChild>
                    <TouchableOpacity activeOpacity={0.9} style={{ width: CARD_WIDTH, marginRight: 16 }}>
                      <View style={styles.carouselCard}>
                        <Image
                          source={item.image}
                          style={styles.carouselImage}
                          contentFit="cover"
                          transition={200}
                        />
                        <LinearGradient
                          colors={['transparent', 'rgba(0,0,0,0.8)']}
                          style={styles.carouselOverlay}
                        />
                        <View style={styles.carouselContent}>
                          <View style={styles.carouselBadge}>
                            <Text style={styles.carouselBadgeText}>{item.xp} XP</Text>
                          </View>
                          <Text style={styles.carouselTitle}>{item.title}</Text>
                          <Text style={styles.carouselSubtitle}>{item.subtitle}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </Link>
                )}
              />

              {/* Pagination Dots */}
              <View style={styles.paginationContainer}>
                {dailyChallenges.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.dot,
                      index === activeIndex ? styles.activeDot : styles.inactiveDot
                    ]}
                  />
                ))}
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Weekly Tasks</Text>
            <View style={styles.gridContainer}>
              {CHALLENGES.filter(c => c.category === 'Weekly').map((challenge) => (
                <Link key={challenge.id} href={`/challenge/${challenge.id}`} asChild>
                  <TouchableOpacity activeOpacity={0.8}>
                    <ChallengeGridItem
                      title={challenge.title}
                      subtitle={challenge.subtitle}
                      image={challenge.image}
                      friendsParticipants={challenge.friendsParticipants}
                      xp={challenge.xp}
                    />
                  </TouchableOpacity>
                </Link>
              ))}
            </View>
          </View>

          {/* Social Section */}
          <View style={styles.section}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <Text style={[styles.sectionTitle, { marginBottom: 0 }]}>
                {friends.length > 0 ? "Friends' Activity" : "Find Friends"}
              </Text>

              {/* If we have friends, show an Add Friend button in the header so they can still manage requests */}
              {friends.length > 0 && (
                <TouchableOpacity onPress={() => router.push('/add-friends')} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <View>
                    <Users size={20} color={Colors.dark.textSecondary} />
                    {pendingIncoming.length > 0 && (
                      <View style={styles.headerBadge}>
                        <Text style={styles.headerBadgeText}>{pendingIncoming.length}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={{ color: Colors.dark.textSecondary, fontWeight: '600' }}>
                    {pendingIncoming.length > 0 ? "Requests" : "Add"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {friends.length > 0 ? (
              friendsActivity.length > 0 ? (
                <View>
                  <FlatList
                    data={friendsActivity}
                    keyExtractor={(item) => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 16 }}
                    renderItem={({ item }) => {
                      // Find challenge details
                      const challenge = CHALLENGES.find(c => c.id === item.challenge_id);
                      // Fallback if challenge undefined (shouldn't happen with consistent data)
                      if (!challenge) return null;

                      return (
                        <TouchableOpacity activeOpacity={0.9} style={{ marginRight: 0 }}>
                          <FriendActivityCard
                            imageUrl={item.image_url} // Use the post's proof image
                            title={challenge.title}   // Challenge Title
                            subtitle={challenge.subtitle} // Challenge Subtitle
                            xp={challenge.xp}
                            avatarUrl={item.profiles.avatar_url}
                            width={width * 0.8} // 80% of screen width for larger impact & scroll hint
                            username={item.profiles.username || 'Unknown'}
                            createdAt={item.created_at}
                          />
                        </TouchableOpacity>
                      );
                    }}
                  />
                </View>
              ) : (
                <Text style={[styles.emptyText, { paddingHorizontal: 20 }]}>
                  No recent activity from your friends.
                </Text>
              )
            ) : (
              <View style={styles.noFriendsContainer}>
                <Text style={styles.noFriendsText}>
                  Connect with friends to see their progress and challenge each other!
                </Text>
                <TouchableOpacity
                  style={styles.searchBar}
                  activeOpacity={0.9}
                  onPress={() => router.push('/add-friends')}
                >
                  <Search size={20} color={Colors.dark.textSecondary} />
                  <Text style={styles.searchText}>Search for friends...</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.inviteButton}
                  onPress={() => router.push('/add-friends')}
                >
                  <Users size={20} color="#000" />
                  <Text style={styles.inviteButtonText}>
                    {pendingIncoming.length > 0 ? "Requests" : "Add Friends"}
                  </Text>
                  {pendingIncoming.length > 0 && (
                    <View style={styles.buttonBadge}>
                      <Text style={styles.buttonBadgeText}>+{pendingIncoming.length}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>

        </ScrollView>
      </SafeAreaView>
    </ScreenGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 24,
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.dark.text,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
    color: Colors.dark.text,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    marginBottom: 16,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    alignItems: 'center',
  },
  carouselCard: {
    height: 180, // Shorter than 200 but similar style
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#1E1E1E',
    position: 'relative',
  },
  carouselImage: {
    width: '100%',
    height: '100%',
  },
  carouselOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '80%',
  },
  carouselContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  carouselTitle: {
    color: '#fff',
    fontSize: 20, // Slightly smaller than Daily Focus 24
    fontWeight: 'bold',
    marginBottom: 2,
    fontFamily: 'PlusJakartaSans-Bold',
  },
  carouselSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Medium',
  },
  carouselBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
    backdropFilter: 'blur(10px)',
  },
  carouselBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'PlusJakartaSans-Bold',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  activeDot: {
    backgroundColor: '#fff',
    width: 20, // Expanded active dot
  },
  inactiveDot: {
    // handled by base dot
  },
  emptyText: {
    color: Colors.dark.textSecondary,
    fontSize: 14,
    fontStyle: 'italic',
  },
  noFriendsContainer: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  noFriendsText: {
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  searchText: {
    color: Colors.dark.textSecondary,
    marginLeft: 8,
    fontSize: 14,
  },
  inviteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 100,
    gap: 8,
    marginTop: 8,
  },
  inviteButtonText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 14,
  },
  headerBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#EF4444',
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.dark.background,
  },
  headerBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  buttonBadge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 4,
  },
  buttonBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
