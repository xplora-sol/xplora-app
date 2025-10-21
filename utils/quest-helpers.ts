export const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'easy':
      return '#4CAF50';
    case 'medium':
      return '#FF9800';
    case 'hard':
      return '#F44336';
    default:
      return '#2196F3';
  }
};

export const getCategoryEmoji = (category: string) => {
  switch (category) {
    case 'social':
      return '👥';
    case 'fitness':
      return '💪';
    case 'exploration':
      return '🗺️';
    case 'education':
      return '📚';
    case 'food':
      return '🍔';
    case 'community':
      return '🤝';
    default:
      return '⭐';
  }
};

export const getActionIcon = (actionType: string) => {
  switch (actionType) {
    case 'photo':
      return '📸';
    case 'quiz':
      return '📝';
    case 'photo_rating':
      return '🌟';
    case 'checkin_photo':
      return '📍';
    case 'timed_photo':
      return '⏰';
    case 'review':
      return '✍️';
    default:
      return '✅';
  }
};

export const getActionColor = (actionType: string) => {
  switch (actionType) {
    case 'photo':
      return '#4CAF50';
    case 'quiz':
      return '#2196F3';
    case 'photo_rating':
      return '#FF9800';
    case 'checkin_photo':
      return '#9C27B0';
    case 'timed_photo':
      return '#FF5722';
    case 'review':
      return '#00BCD4';
    default:
      return '#2196F3';
  }
};
