import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/hooks/query/use-auth';
import { FeatureList } from '@/sections/Auth/feature-list';
import { LoginForm } from '@/sections/Auth/login-form';
import { LoginHeader } from '@/sections/Auth/login-header';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
} from 'react-native';

export default function LoginScreen() {
    const [username, setUsername] = useState('');
    const [isConnecting, setIsConnecting] = useState(false);
    const router = useRouter();
    const { login } = useAuth();

    const connectMetaMask = async () => {
        if (!username.trim()) {
            Alert.alert('Required Field', 'Please enter a username to continue.');
            return;
        }

        if (username.trim().length < 3) {
            Alert.alert('Invalid Username', 'Username must be at least 3 characters long.');
            return;
        }

        setIsConnecting(true);

        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));

            const mockWalletAddress = `0x${Math.random().toString(16).substr(2, 40)}`;

            await login({ walletAddress: mockWalletAddress, username: username.trim() });

            router.replace('/onboarding');
        } catch (error) {
            console.error('Login error:', error);
            Alert.alert('Connection Failed', 'Unable to connect to MetaMask. Please try again.');
        } finally {
            setIsConnecting(false);
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
                        onConnectPress={connectMetaMask}
                        isConnecting={isConnecting}
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
