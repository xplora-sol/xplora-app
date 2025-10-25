import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/hooks/query/use-auth';
import { FeatureList } from '@/sections/Auth/feature-list';
import { LoginForm } from '@/sections/Auth/login-form';
import { LoginHeader } from '@/sections/Auth/login-header';
import { useAccount, useAppKit, useAppKitState } from '@reown/appkit-react-native';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet
} from 'react-native';

export default function LoginScreen() {
    const [username, setUsername] = useState('');
    const router = useRouter();
    const { login } = useAuth();
    const { open } = useAppKit();

    const { address, isConnected } = useAccount();
    const { isLoading, isOpen } = useAppKitState()

    const requestedUsernameRef = useRef<string | null>(null);

    useEffect(() => {
        if (!isOpen && !isLoading && isConnected) {
            const usernameToUse = requestedUsernameRef.current ?? username.trim();

            login({ walletAddress: address ?? "", username: usernameToUse });
            requestedUsernameRef.current = null;
            router.replace('/onboarding');
        }
    }, [isOpen, isLoading, isConnected, address, login, router, username]);

    const connectWallet = async () => {
        if (!username.trim()) {
            Alert.alert('Required Field', 'Please enter a username to continue.');
            return;
        }

        if (username.trim().length < 3) {
            Alert.alert('Invalid Username', 'Username must be at least 3 characters long.');
            return;
        }

        requestedUsernameRef.current = username.trim();

        open();
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <ThemedView style={styles.content}>
                    <LoginHeader />
                    <LoginForm
                        username={username}
                        onUsernameChange={setUsername}
                        onConnectPress={connectWallet}
                        isConnecting={isLoading}
                    />
                    <FeatureList />
                </ThemedView>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    content: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
        minHeight: Dimensions.get('window').height,
    },
});
