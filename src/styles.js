import {Dimensions} from 'react-native';

// Based on iPhone SE 2nd generation
const BASE_WIDTH = 375;
const {height, width} = Dimensions.get('window');

export const horizontalScale = (size: number): number => {
  if (width > height) {
    return (height / BASE_WIDTH) * size;
  }
  return (width / BASE_WIDTH) * size;
};
