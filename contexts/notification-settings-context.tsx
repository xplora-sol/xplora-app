import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

export interface NotificationSettings {
    enabled: boolean;
    radiusMeters: number;
}

interface NotificationSettingsContextType {
    settings: NotificationSettings;
    updateSettings: (newSettings: Partial<NotificationSettings>) => Promise<void>;
    isLoading: boolean;
}

const STORAGE_KEY = '@quest_notification_settings';

const DEFAULT_SETTINGS: NotificationSettings = {
    enabled: true,
    radiusMeters: 50,
};

const NotificationSettingsContext = createContext<NotificationSettingsContextType | undefined>(
    undefined
);

export function NotificationSettingsProvider({ children }: { children: React.ReactNode }) {
    const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_SETTINGS);
    const [isLoading, setIsLoading] = useState(true);

    // Load settings from storage on mount
    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const storedSettings = await AsyncStorage.getItem(STORAGE_KEY);
            if (storedSettings) {
                setSettings(JSON.parse(storedSettings));
            }
        } catch (error) {
            console.error('Error loading notification settings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateSettings = async (newSettings: Partial<NotificationSettings>) => {
        try {
            const updatedSettings = { ...settings, ...newSettings };
            setSettings(updatedSettings);
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSettings));
        } catch (error) {
            console.error('Error saving notification settings:', error);
        }
    };

    return (
        <NotificationSettingsContext.Provider value={{ settings, updateSettings, isLoading }}>
            {children}
        </NotificationSettingsContext.Provider>
    );
}

export function useNotificationSettings() {
    const context = useContext(NotificationSettingsContext);
    if (context === undefined) {
        throw new Error('useNotificationSettings must be used within a NotificationSettingsProvider');
    }
    return context;
}
