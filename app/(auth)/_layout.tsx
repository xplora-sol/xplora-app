import { useAuth } from '@/hooks/query/use-auth';
import { Redirect, Stack } from 'expo-router';

export default function AuthLayout() {
    const { isAuthenticated, hasCompletedOnboarding } = useAuth();

    if (isAuthenticated && hasCompletedOnboarding) {
        return <Redirect href="/(tabs)" />;
    }

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="login" />
            <Stack.Screen name="onboarding" />
        </Stack>
    );
}
