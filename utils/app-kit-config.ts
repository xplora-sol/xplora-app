import '@walletconnect/react-native-compat';
import { storage } from './async-storage';
import { createAppKit, solana, solanaDevnet, solanaTestnet } from '@reown/appkit-react-native';
import { solanaAdapter } from './solana-adapter';
import { PhantomConnector, SolflareConnector } from '@reown/appkit-solana-react-native';
import * as Clipboard from 'expo-clipboard';

const projectId = '5f4e68137d020aa12ca9851a70254c53';

const IS_DEV = process.env.NODE_ENV === 'development';

export const appKit = createAppKit({
  projectId,
  networks: [solana, solanaDevnet, solanaTestnet],
  adapters: [solanaAdapter],
  storage: storage,
  extraConnectors: [
    new PhantomConnector({ cluster: 'devnet' }), // Or 'devnet', 'testnet', 'mainnet-beta'
    new SolflareConnector({ cluster: 'devnet' }), // Or 'devnet', 'testnet'
  ],

  metadata: {
    name: 'Xplora',
    description: 'My dApp description',
    url: 'https://myapp.com',
    icons: ['https://myapp.com/icon.png'],
    redirect: {
      native: 'xplora://',
    },
  },

  ...(IS_DEV ? { debug: true } : {}),
  enableAnalytics: true,

  clipboardClient: {
    setString: async (value: string) => {
      await Clipboard.setStringAsync(value);
    },
  },

  features: {
    socials: [],
  },
});
