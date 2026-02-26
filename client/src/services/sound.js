import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

class SoundService {
  constructor() {
    this.successSound = null;
    this.errorSound = null;
  }

  async playSuccess() {
    console.log('Playing Success Sound');
    if (Platform.OS !== 'web') {
        try {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

            // To enable real sound, add audio files to assets/ and uncomment:
            // const { sound } = await Audio.Sound.createAsync(require('../../assets/success.mp3'));
            // await sound.playAsync();
        } catch (error) {
            console.warn('Error playing success feedback', error);
        }
    }
  }

  async playError() {
    console.log('Playing Error Sound');
    if (Platform.OS !== 'web') {
        try {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

            // To enable real sound, add audio files to assets/ and uncomment:
            // const { sound } = await Audio.Sound.createAsync(require('../../assets/error.mp3'));
            // await sound.playAsync();
        } catch (error) {
            console.warn('Error playing error feedback', error);
        }
    }
  }
}

export default new SoundService();
