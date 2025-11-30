import { TaskItem } from '@/components/TaskItem';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ChallengesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Challenges</Text>
          <Text style={styles.headerSubtitle}>Push your limits today.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Tasks</Text>
          <TaskItem
            title="Morning Hydration"
            description="Drink 500ml of water immediately after waking up."
          />
          <TaskItem
            title="30 Min Workout"
            description="Complete a high-intensity interval training session."
          />
          <TaskItem
            title="Read 10 Pages"
            description="Read a non-fiction book for self-improvement."
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Tasks</Text>
          <TaskItem
            title="Run 10km Total"
            description="Accumulate 10km of running distance this week."
          />
          <TaskItem
            title="Meditation Streak"
            description="Meditate for at least 10 minutes for 5 days."
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    color: '#333',
  },
});
