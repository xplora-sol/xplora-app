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
import AsyncStorage from '@react-native-async-storage/async-storage';

const PENDING_USERNAME_KEY = '@pending_username';

export default function LoginScreen() {
    const [username, setUsername] = useState('');
    const router = useRouter();
    const { login } = useAuth();
    const { open } = useAppKit();

    const { address, isConnected } = useAccount();
    const { isLoading, isOpen } = useAppKitState();

    const requestedUsernameRef = useRef<string | null>(null);

    // Load pending username on mount
    useEffect(() => {
        const loadPendingUsername = async () => {
            try {
                const pendingUsername = await AsyncStorage.getItem(PENDING_USERNAME_KEY);
                if (pendingUsername) {
                    requestedUsernameRef.current = pendingUsername;
                    setUsername(pendingUsername);
                }
            } catch (error) {
                console.error('Failed to load pending username:', error);
            }
        };

        loadPendingUsername();
    }, []);

    useEffect(() => {
        const handleConnection = async () => {
            if (!isOpen && !isLoading && isConnected) {
                try {
                    // Try to get username from AsyncStorage first, then ref, then state
                    let usernameToUse = await AsyncStorage.getItem(PENDING_USERNAME_KEY);
                    
                    if (!usernameToUse) {
                        usernameToUse = requestedUsernameRef.current ?? username.trim();
                    }

                    if (usernameToUse) {
                        login({ walletAddress: address ?? "", username: usernameToUse });
                        
                        // Clear the stored username after successful login
                        await AsyncStorage.removeItem(PENDING_USERNAME_KEY);
                        requestedUsernameRef.current = null;
                        
                        router.replace('/onboarding');
                    }
                } catch (error) {
                    console.error('Failed to handle connection:', error);
                    Alert.alert('Error', 'Failed to complete login. Please try again.');
                }
            }
        };

        handleConnection();
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

        try {
            const trimmedUsername = username.trim();
            
            // Save to both ref and AsyncStorage
            requestedUsernameRef.current = trimmedUsername;
            await AsyncStorage.setItem(PENDING_USERNAME_KEY, trimmedUsername);

            open();
        } catch (error) {
            console.error('Failed to save username:', error);
            Alert.alert('Error', 'Failed to save username. Please try again.');
        }
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