// Prompt database organized by category
// Each prompt includes context filters for the "Give me a prompt" feature

export const CATEGORIES = {
  ART: 'art',
  PHOTOGRAPHY: 'photography',
  NATURE: 'nature',
  FOOD: 'food',
  SPORTS: 'sports',
  WRITING: 'writing',
  MUSIC: 'music',
  CRAFT: 'craft'
};

export const LOCATIONS = {
  HOME: 'home',
  PUBLIC: 'public',
  RESTAURANT: 'restaurant',
  OUTDOORS: 'outdoors'
};

export const GROUP_SIZES = {
  SOLO: 'solo',
  ONE: '1-2 people',
  SMALL: '3-4 people',
  LARGE: '5+ people'
};

export const PROMPTS = [
  // Art prompts
  {
    id: 'art_1',
    category: CATEGORIES.ART,
    text: 'Draw a doodle of the view outside your window',
    location: [LOCATIONS.HOME],
    groupSize: [GROUP_SIZES.SOLO],
    difficulty: 'easy'
  },
  {
    id: 'art_2',
    category: CATEGORIES.ART,
    text: 'Sketch the most interesting object within arms reach using only 5 lines',
    location: [LOCATIONS.HOME, LOCATIONS.PUBLIC, LOCATIONS.RESTAURANT],
    groupSize: [GROUP_SIZES.SOLO],
    difficulty: 'medium'
  },
  {
    id: 'art_3',
    category: CATEGORIES.ART,
    text: 'Create a collaborative drawing where each person adds one element',
    location: [LOCATIONS.HOME, LOCATIONS.PUBLIC],
    groupSize: [GROUP_SIZES.SMALL, GROUP_SIZES.LARGE],
    difficulty: 'easy'
  },

  // Photography prompts
  {
    id: 'photo_1',
    category: CATEGORIES.PHOTOGRAPHY,
    text: 'Take a photo of something that represents how you feel right now',
    location: [LOCATIONS.HOME, LOCATIONS.PUBLIC, LOCATIONS.OUTDOORS],
    groupSize: [GROUP_SIZES.SOLO],
    difficulty: 'easy'
  },
  {
    id: 'photo_2',
    category: CATEGORIES.PHOTOGRAPHY,
    text: 'Find and photograph an interesting pattern or texture',
    location: [LOCATIONS.HOME, LOCATIONS.PUBLIC, LOCATIONS.RESTAURANT, LOCATIONS.OUTDOORS],
    groupSize: [GROUP_SIZES.SOLO],
    difficulty: 'easy'
  },
  {
    id: 'photo_3',
    category: CATEGORIES.PHOTOGRAPHY,
    text: 'Take 5 photos from 5 completely different angles of the same subject',
    location: [LOCATIONS.PUBLIC, LOCATIONS.OUTDOORS],
    groupSize: [GROUP_SIZES.SOLO, GROUP_SIZES.ONE],
    difficulty: 'medium'
  },

  // Nature prompts
  {
    id: 'nature_1',
    category: CATEGORIES.NATURE,
    text: 'Go outside and photograph an interesting plant or flower',
    location: [LOCATIONS.OUTDOORS],
    groupSize: [GROUP_SIZES.SOLO],
    difficulty: 'easy'
  },
  {
    id: 'nature_2',
    category: CATEGORIES.NATURE,
    text: 'Collect 3 natural objects and arrange them into a small sculpture',
    location: [LOCATIONS.OUTDOORS],
    groupSize: [GROUP_SIZES.SOLO, GROUP_SIZES.ONE],
    difficulty: 'medium'
  },
  {
    id: 'nature_3',
    category: CATEGORIES.NATURE,
    text: 'Sit outside for 5 minutes and list every sound you hear',
    location: [LOCATIONS.OUTDOORS, LOCATIONS.HOME],
    groupSize: [GROUP_SIZES.SOLO],
    difficulty: 'easy'
  },

  // Food prompts
  {
    id: 'food_1',
    category: CATEGORIES.FOOD,
    text: 'Create a face using food on your plate',
    location: [LOCATIONS.HOME, LOCATIONS.RESTAURANT],
    groupSize: [GROUP_SIZES.SOLO, GROUP_SIZES.ONE, GROUP_SIZES.SMALL],
    difficulty: 'easy'
  },
  {
    id: 'food_2',
    category: CATEGORIES.FOOD,
    text: 'Taste something with your eyes closed and describe it in 3 unexpected words',
    location: [LOCATIONS.HOME, LOCATIONS.RESTAURANT],
    groupSize: [GROUP_SIZES.SOLO, GROUP_SIZES.ONE],
    difficulty: 'medium'
  },
  {
    id: 'food_3',
    category: CATEGORIES.FOOD,
    text: 'Challenge: Create the most aesthetically pleasing plate presentation',
    location: [LOCATIONS.HOME, LOCATIONS.RESTAURANT],
    groupSize: [GROUP_SIZES.ONE, GROUP_SIZES.SMALL],
    difficulty: 'medium'
  },

  // Sports/Movement prompts
  {
    id: 'sports_1',
    category: CATEGORIES.SPORTS,
    text: 'Create and name a new stretch or yoga pose',
    location: [LOCATIONS.HOME, LOCATIONS.PUBLIC],
    groupSize: [GROUP_SIZES.SOLO],
    difficulty: 'easy'
  },
  {
    id: 'sports_2',
    category: CATEGORIES.SPORTS,
    text: 'Make up a simple game using only objects in this room',
    location: [LOCATIONS.HOME, LOCATIONS.PUBLIC],
    groupSize: [GROUP_SIZES.ONE, GROUP_SIZES.SMALL, GROUP_SIZES.LARGE],
    difficulty: 'medium'
  },
  {
    id: 'sports_3',
    category: CATEGORIES.SPORTS,
    text: 'Go for a 10-minute walk and change direction every time you see something blue',
    location: [LOCATIONS.OUTDOORS],
    groupSize: [GROUP_SIZES.SOLO, GROUP_SIZES.ONE],
    difficulty: 'easy'
  },

  // Writing prompts
  {
    id: 'writing_1',
    category: CATEGORIES.WRITING,
    text: 'Write a 6-word story about your day so far',
    location: [LOCATIONS.HOME, LOCATIONS.PUBLIC, LOCATIONS.RESTAURANT],
    groupSize: [GROUP_SIZES.SOLO],
    difficulty: 'easy'
  },
  {
    id: 'writing_2',
    category: CATEGORIES.WRITING,
    text: 'Describe the person nearest to you as a character in a novel (just in your mind or notes)',
    location: [LOCATIONS.PUBLIC, LOCATIONS.RESTAURANT],
    groupSize: [GROUP_SIZES.SOLO],
    difficulty: 'medium'
  },
  {
    id: 'writing_3',
    category: CATEGORIES.WRITING,
    text: 'Write a conversation between two objects in the room',
    location: [LOCATIONS.HOME, LOCATIONS.PUBLIC],
    groupSize: [GROUP_SIZES.SOLO],
    difficulty: 'medium'
  },

  // Music prompts
  {
    id: 'music_1',
    category: CATEGORIES.MUSIC,
    text: 'Create a 10-second rhythm using only body percussion',
    location: [LOCATIONS.HOME, LOCATIONS.PUBLIC],
    groupSize: [GROUP_SIZES.SOLO, GROUP_SIZES.ONE, GROUP_SIZES.SMALL],
    difficulty: 'easy'
  },
  {
    id: 'music_2',
    category: CATEGORIES.MUSIC,
    text: 'Hum a melody inspired by the colors you see around you',
    location: [LOCATIONS.HOME, LOCATIONS.PUBLIC, LOCATIONS.OUTDOORS],
    groupSize: [GROUP_SIZES.SOLO],
    difficulty: 'medium'
  },
  {
    id: 'music_3',
    category: CATEGORIES.MUSIC,
    text: 'Make music using 3 objects nearby (tap, shake, scrape)',
    location: [LOCATIONS.HOME],
    groupSize: [GROUP_SIZES.SOLO, GROUP_SIZES.ONE],
    difficulty: 'easy'
  },

  // Craft prompts
  {
    id: 'craft_1',
    category: CATEGORIES.CRAFT,
    text: 'Make and fly a paper airplane. See how far it goes!',
    location: [LOCATIONS.HOME, LOCATIONS.PUBLIC, LOCATIONS.OUTDOORS],
    groupSize: [GROUP_SIZES.SOLO, GROUP_SIZES.ONE],
    difficulty: 'easy'
  },
  {
    id: 'craft_2',
    category: CATEGORIES.CRAFT,
    text: 'Fold a piece of paper 20 times in different ways to create a sculpture',
    location: [LOCATIONS.HOME, LOCATIONS.PUBLIC],
    groupSize: [GROUP_SIZES.SOLO],
    difficulty: 'easy'
  },
  {
    id: 'craft_3',
    category: CATEGORIES.CRAFT,
    text: 'Create something useful from trash or recyclables nearby',
    location: [LOCATIONS.HOME],
    groupSize: [GROUP_SIZES.SOLO, GROUP_SIZES.ONE],
    difficulty: 'medium'
  }
];

// Helper function to get prompts by category
export const getPromptsByCategory = (category) => {
  return PROMPTS.filter(prompt => prompt.category === category);
};

// Helper function to filter prompts by context
export const filterPromptsByContext = (prompts, location, groupSize) => {
  return prompts.filter(prompt => {
    const locationMatch = !location || prompt.location.includes(location);
    const groupMatch = !groupSize || prompt.groupSize.includes(groupSize);
    return locationMatch && groupMatch;
  });
};

// Get a random prompt from filtered results
export const getRandomPrompt = (prompts) => {
  if (prompts.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * prompts.length);
  return prompts[randomIndex];
};
