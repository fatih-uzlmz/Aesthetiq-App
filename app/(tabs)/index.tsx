import { PostCard } from '@/components/PostCard';
import { FlatList, SafeAreaView, StyleSheet } from 'react-native';

const DUMMY_POSTS = [
  {
    id: '1',
    username: 'alex_fitness',
    challengeTitle: 'Morning Run Challenge',
    imageUrl: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&auto=format&fit=crop&q=60',
    timestamp: '2h ago',
  },
  {
    id: '2',
    username: 'sarah_yoga',
    challengeTitle: 'Daily Meditation',
    imageUrl: 'https://images.unsplash.com/photo-1544367563-12123d8965cd?w=800&auto=format&fit=crop&q=60',
    timestamp: '4h ago',
  },
  {
    id: '3',
    username: 'mike_lifts',
    challengeTitle: '100 Pushups',
    imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&auto=format&fit=crop&q=60',
    timestamp: '6h ago',
  },
];

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={DUMMY_POSTS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostCard
            username={item.username}
            challengeTitle={item.challengeTitle}
            imageUrl={item.imageUrl}
            timestamp={item.timestamp}
          />
        )}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    padding: 16,
  },
});
