
import { ExpoConfig, ConfigContext } from 'expo/config';


export default ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    "name": "X-plora",
    "slug": "xplora",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "xplora",
    "userInterfaceStyle": "dark",
    "newArchEnabled": true,
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.anonymous.xplora",
      "infoPlist": {
        "LSApplicationQueriesSchemes": [
          "metamask",
          "trust",
          "safe",
          "rainbow",
          "uniswap",
          "phantom",
          "solflare"
        ]
      }
    },
    "android": {
      "adaptiveIcon": {
        "backgroundColor": "#002070",
        "foregroundImage": "./assets/images/foreground.png",
        "backgroundImage": "./assets/images/background.png",
        "monochromeImage": "./assets/images/monochrome.png"
      },
      "edgeToEdgeEnabled": true,
      "predictiveBackGestureEnabled": false,
      "package": "com.anonymous.xplora"
    },
    "web": {
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/splash-icon.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#002070",
          "dark": {
            "backgroundColor": "#002070"
          }
        }
      ],
      [
        "react-native-maps",
        {
          "androidGoogleMapsApiKey": process.env.GOOGLE_MAPS_API_KEY
        }
      ],
      "./modules/queries.js"
    ],
    "experiments": {
      "typedRoutes": true,
      "reactCompiler": true
    },
    "extra": {
      "router": {},
      "eas": {
        "projectId": "e930d5f2-1f02-4b85-88cd-8de74800bfb2"
      }
    }
})
