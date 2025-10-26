import * as dotenv from 'dotenv';
import { ConfigContext, ExpoConfig } from 'expo/config';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const googleMapsApiKey =
  process.env.GOOGLE_MAPS_API_KEY_ANDROID || process.env.GOOGLE_MAPS_API_KEY || '';

if (!googleMapsApiKey) {
  console.warn(
    '[app.config] GOOGLE_MAPS_API_KEY_ANDROID not found in environment. ' +
      'Set it in your shell or use EAS secrets for cloud builds.',
  );
}

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'X-plora',
  slug: 'xplora',
  android: {
    adaptiveIcon: {
      backgroundColor: '#002070',
      foregroundImage: './assets/images/foreground.png',
      backgroundImage: './assets/images/background.png',
      monochromeImage: './assets/images/monochrome.png',
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    package: 'com.anonymous.xplora',
    config: {
      googleMaps: {
        apiKey: googleMapsApiKey,
      },
    },
  },
});
