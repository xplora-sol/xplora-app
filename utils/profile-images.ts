import { ImageSourcePropType } from 'react-native';

const PROFILE_IMAGES: ImageSourcePropType[] = [
  require('../assets/images/profileImages/profile1.jpg'),
  require('../assets/images/profileImages/profile2.jpg'),
  require('../assets/images/profileImages/profile3.jpg'),
  require('../assets/images/profileImages/profile4.jpg'),
  require('../assets/images/profileImages/profile5.jpg'),
  require('../assets/images/profileImages/profile6.jpg'),
  require('../assets/images/profileImages/profile7.jpg'),
  require('../assets/images/profileImages/profile8.jpg'),
  require('../assets/images/profileImages/profile9.jpg'),
  require('../assets/images/profileImages/profile10.jpg'),
];

function hashStringToInt(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0; // convert to 32bit int
  }
  return Math.abs(h);
}

export function getRandomProfileImage(): ImageSourcePropType {
  const idx = Math.floor(Math.random() * PROFILE_IMAGES.length);
  return PROFILE_IMAGES[idx];
}

export function getProfileImageForKey(key?: string): ImageSourcePropType {
  if (!key) return getRandomProfileImage();
  const idx = hashStringToInt(key) % PROFILE_IMAGES.length;
  return PROFILE_IMAGES[idx];
}

export default PROFILE_IMAGES;
