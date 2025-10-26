import 'text-encoding'; // needed for @solana/web3.js to work
import '@walletconnect/react-native-compat';

import { SolanaAdapter } from '@reown/appkit-solana-react-native';

export const solanaAdapter = new SolanaAdapter();
