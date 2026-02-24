const WORKOUT_IMAGES = [
    require('../assets/images/workout/img_1.png'),
    require('../assets/images/workout/img_2.png'),
    require('../assets/images/workout/img_3.png'),
    require('../assets/images/workout/img_4.png'),
    require('../assets/images/workout/img_5.png'),
];

const STUDY_IMAGES = [
    require('../assets/images/study/img_1.png'),
    require('../assets/images/study/img_2.png'),
    require('../assets/images/study/img_3.png'),
    require('../assets/images/study/img_4.png'),
    require('../assets/images/study/img_5.png'),
];

const RUNNING_IMAGES = [
    require('../assets/images/running/img_1.png'),
    require('../assets/images/running/img_2.png'),
    require('../assets/images/running/img_3.png'),
    require('@/assets/images/running/img_4.png'),
];

export const POSTS = [
    {
        id: 'p1',
        challengeId: 'c7',
        username: 'sarahwills_',
        challengeTitle: 'Morning Mile',
        imageUrl: RUNNING_IMAGES[0], // Dynamic running shot
        timestamp: 'Trending now',
        likes: 5182,
        caption: 'Join the movement.',
        participants: '5,182',
        description: 'Start your day with a 1 mile run. Rain or shine, we move.',
        friendsActivity: []
    },
    {
        id: 'p2',
        challengeId: 'c2',
        username: 'mike_lifts',
        challengeTitle: 'Cardio Session',
        imageUrl: require('@/assets/images/challenge_cardio_new.png'),
        timestamp: 'Trending now',
        likes: 3420,
        caption: 'Cardio session done.',
        participants: '3,420',
        description: '30 minutes intensity. Felt great to get moving.',
        friendsActivity: []
    },
    {
        id: 'p3',
        challengeId: 'c6', // 1 Hour Study
        username: 'alex_fitness',
        challengeTitle: '1 Hour Deep Work',
        imageUrl: STUDY_IMAGES[0], // Sync with Challenge
        timestamp: 'Trending now',
        likes: 1240,
        caption: 'Focus mode.',
        participants: '1,240',
        description: 'Commit to one hour of deep work with zero distractions.',
        friendsActivity: []
    }
];

export const CHALLENGES = [
    {
        id: 'c_new_1',
        title: 'Phone-Free Morning',
        subtitle: 'Start your day present.',
        description: 'Avoid your phone for the first 30 minutes of your day. No scrolling, no checking emails.',
        instructions: [
            'For 30 minutes after waking up, your phone stays untouched.',
            'Notifications are irrelevant until the timer ends.',
            'Breaking this resets your streak.'
        ],
        category: 'Daily',
        isTimeSpecific: true,
        image: require('@/assets/images/challenge_sunrise.png'),
        friendsParticipants: [],
        xp: 150
    },
    {
        id: 'c_new_2',
        title: 'Daily Reading Session',
        subtitle: 'Expand your mind.',
        description: 'Read a book (fiction or non-fiction) for 30 minutes. Audiobooks do not count for this one.',
        instructions: [
            '30 minutes of focused reading is non-negotiable.',
            'Audiobooks are not permitted for this challenge.',
            'Phone must be in another room or DND.'
        ],
        category: 'Daily',
        isTimeSpecific: false,
        image: require('@/assets/images/challenge_reading.jpg'),
        friendsParticipants: [],
        xp: 200
    },
    {
        id: 'c6',
        title: '1 Hour Study',
        subtitle: 'Deep work session.',
        description: 'Commit to one hour of deep work with zero distractions.',
        instructions: [
            '60 minutes of deep work. No exceptions.',
            'Irrelevant tabs and apps must be closed.',
            'Any distraction voids the session.'
        ],
        category: 'Daily',
        isTimeSpecific: false,
        image: STUDY_IMAGES[0], // Synced with p3
        friendsParticipants: [
            { name: 'Sarah', image: require('@/assets/images/avatar_3.png') }
        ],
        xp: 200,
        type: 'timer',
        duration: 1 // Minutes (Changed for testing)
    },
    {
        id: 'c_new_4',
        title: 'Outdoor Walk',
        subtitle: 'Connect with nature.',
        description: 'Walk outside for 30 minutes. Fresh air and movement.',
        instructions: [
            '30 minutes of continuous movement outdoors.',
            'This is not a commute, it is intentional time.',
            'Observe your surroundings. Be present.'
        ],
        category: 'Daily',
        isTimeSpecific: false,
        image: require('@/assets/images/challenge_walk_1.jpg'),
        friendsParticipants: [],
        xp: 200
    },
    {
        id: 'c2',
        title: 'Cardio Session',
        subtitle: 'Walk, run, or bike.',
        description: 'Get your heart rate up for 30 minutes. Walking outside, cycling, or running all count.',
        instructions: [
            '30 minutes of continuous activity.',
            'Heart rate must be elevated.',
            'No stopping until the time is up.'
        ],
        category: 'Daily',
        isTimeSpecific: false,
        image: require('@/assets/images/challenge_cardio_new.png'), // Updated image
        friendsParticipants: [],
        xp: 250
    },
    {
        id: 'c_new_3',
        title: 'Daily Journal',
        subtitle: 'Reflect on your day.',
        description: 'Spend 10-15 minutes writing down your thoughts, goals, or gratitude.',
        instructions: [
            'Write at least one full page or 300 words.',
            'Honesty is required. No filtering.',
            'This is for your eyes only.'
        ],
        category: 'Daily',
        isTimeSpecific: false,
        image: require('@/assets/images/challenge_journal.png'),
        friendsParticipants: [],
        xp: 100
    },
    {
        id: 'c_new_weekly_1',
        title: '5 Deep Work Sessions',
        subtitle: 'Master your focus.',
        description: 'Complete 5 sessions of deep work (minimum 1 hour each) this week.',
        instructions: [
            '5 sessions. 1 hour minimum each.',
            'Deep work means zero distractions.',
            'Track every minute.'
        ],
        category: 'Weekly',
        image: STUDY_IMAGES[0],
        friendsParticipants: [],
        xp: 500,
        linkedDailyChallengeId: 'c6',
        requiredCompletions: 5
    },
    {
        id: 'c_new_weekly_2',
        title: 'Journal 5 Nights',
        subtitle: 'Consistent reflection.',
        description: 'Journal for 5 nights this week before bed.',
        instructions: [
            'The journal stays by the bed.',
            'Write before sleep, not in the morning.',
            'Missed nights cannot be made up.'
        ],
        category: 'Weekly',
        image: require('@/assets/images/challenge_journal.png'),
        friendsParticipants: [],
        xp: 400,
        linkedDailyChallengeId: 'c_new_3',
        requiredCompletions: 5
    },
    {
        id: 'c7',
        title: 'Morning Mile Run',
        subtitle: 'Start with cardio.',
        description: 'Start your day with a 1 Mile run.',
        instructions: [
            'Run 1 mile before starting your day.',
            'Pace is irrelevant, completion is mandatory.',
            'No excuses for weather.'
        ],
        category: 'Daily',
        isTimeSpecific: true,
        image: RUNNING_IMAGES[0], // Synced with p1
        friendsParticipants: [
            { name: 'Mike', image: require('@/assets/images/avatar_1.png') }
        ],
        xp: 200
    },
    {
        id: 'c10',
        title: 'Healthy Breakfast',
        subtitle: 'Start strong.',
        description: 'Fuel your day with a nutritious, aesthetic breakfast bowl.',
        instructions: [
            'Prepare a nutritious bowl.',
            'Aesthetics matter—make it look intentional.',
            'Document it before consuming.'
        ],
        category: 'Daily',
        isTimeSpecific: true,
        image: require('@/assets/images/aesthetic/food_1.png'),
        friendsParticipants: [],
        xp: 100
    }
];

export const EXPLORE_POSTS = [
    {
        id: 'exp-1',
        challengeId: 'gym-aest-1',
        username: 'iron.aesthetics',
        challengeTitle: 'Gym Focus',
        imageUrl: require('@/assets/images/aesthetic/gym_1.png'),
        timestamp: '30m ago',
        likes: 1240,
        caption: 'Consistency is key.',
        participants: 2300,
        friendsActivity: []
    },
    {
        id: 'exp-2',
        challengeId: 'study-aest-1',
        username: 'study.loft',
        challengeTitle: 'Deep Work',
        imageUrl: require('@/assets/images/aesthetic/study_1.png'),
        timestamp: '1h ago',
        likes: 3450,
        caption: 'Final stretch.',
        participants: 4500,
        friendsActivity: []
    },
    {
        id: 'exp-3',
        challengeId: 'study-aest-2',
        username: 'night.scholar',
        challengeTitle: 'Midnight Oil',
        imageUrl: require('@/assets/images/aesthetic/study_2.png'),
        timestamp: '2h ago',
        likes: 890,
        caption: 'Focus mode.',
        participants: 670,
        friendsActivity: []
    },
    {
        id: 'exp-4',
        challengeId: 'food-aest-1',
        username: 'green.bowl',
        challengeTitle: 'Healthy Breakfast',
        imageUrl: require('@/assets/images/aesthetic/food_1.png'),
        timestamp: '4h ago',
        likes: 2100,
        caption: 'Start the day right.',
        participants: 1200,
        friendsActivity: []
    },
    {
        id: 'exp-5',
        challengeId: 'study-aest-3',
        username: 'lofi.beats',
        challengeTitle: 'Study Vibes',
        imageUrl: require('@/assets/images/aesthetic/study_3.png'),
        timestamp: '5h ago',
        likes: 1560,
        caption: 'Chill settings.',
        participants: 890,
        friendsActivity: []
    },
    // Keep some Unsplash fills for variety if needed, or stick to the 5 user provided.
    // User said "fill this page more", so let's cycle them or keep a mix?
    // User said "lets use these... for each challenge... store them in their respective class"
    // I will repeat them to fill the grid for now as requested "fill that explore page with posts".
    {
        id: 'exp-6',
        challengeId: 'gym-aest-2',
        username: 'dark.gym',
        challengeTitle: 'Heavy Lifting',
        imageUrl: require('@/assets/images/aesthetic/gym_1.png'),
        timestamp: '6h ago',
        likes: 3200,
        caption: 'Push.',
        participants: 5000,
        friendsActivity: []
    },
    {
        id: 'exp-7',
        challengeId: 'study-aest-4',
        username: 'book.club',
        challengeTitle: 'Reading List',
        imageUrl: require('@/assets/images/aesthetic/study_1.png'),
        timestamp: '7h ago',
        likes: 450,
        caption: 'Chapter 1.',
        participants: 200,
        friendsActivity: []
    },
    {
        id: 'exp-8',
        challengeId: 'food-aest-2',
        username: 'fresh.start',
        challengeTitle: 'Clean Eating',
        imageUrl: require('@/assets/images/aesthetic/food_1.png'),
        timestamp: '8h ago',
        likes: 780,
        caption: 'Nutrition.',
        participants: 340,
        friendsActivity: []
    }
];

export const FOCUS_RECOMMENDATIONS: Record<string, string[]> = {
    "Career Growth": ['c6', 'c_new_weekly_1', 'c_new_2'], // Deep Work, 5 Deep Work Sessions, Reading
    "Physical Health": ['c7', 'c2', 'c10'], // Morning Mile, Cardio, Healthy Breakfast
    "Mental Clarity": ['c_new_1', 'c_new_4', 'c_new_3'], // Phone-Free, Outdoor Walk, Journal
    "Breaking Bad Habits": ['c_new_1', 'c_new_3', 'c2'], // Phone-Free, Journal, Cardio (replace bad with good)
    "Academic Success": ['c6', 'c_new_2', 'c_new_weekly_1'] // Study, Reading, Weekly Study
};
