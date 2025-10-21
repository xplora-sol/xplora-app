import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider, Persister } from '@tanstack/react-query-persist-client';
import React from 'react';

// Create a client
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            gcTime: 1000 * 60 * 60 * 24, // 24 hours
            staleTime: 1000 * 60 * 5, // 5 minutes
            retry: 1,
        },
    },
});

// Create persister using AsyncStorage
const asyncStoragePersister: Persister = {
    persistClient: async (client) => {
        try {
            await AsyncStorage.setItem('REACT_QUERY_OFFLINE_CACHE', JSON.stringify(client));
        } catch (error) {
            console.error('Failed to persist query client:', error);
        }
    },
    restoreClient: async () => {
        try {
            const cachedClient = await AsyncStorage.getItem('REACT_QUERY_OFFLINE_CACHE');
            return cachedClient ? JSON.parse(cachedClient) : undefined;
        } catch (error) {
            console.error('Failed to restore query client:', error);
            return undefined;
        }
    },
    removeClient: async () => {
        try {
            await AsyncStorage.removeItem('REACT_QUERY_OFFLINE_CACHE');
        } catch (error) {
            console.error('Failed to remove query client:', error);
        }
    },
};

export function ReactQueryProvider({ children }: { children: React.ReactNode }) {
    return (
        <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{ persister: asyncStoragePersister }}
        >
            {children}
        </PersistQueryClientProvider>
    );
}
