import { ScrollView, type ScrollViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedScrollViewProps = ScrollViewProps & {
    lightColor?: string;
    darkColor?: string;
};

export function ThemedScrollView({
    style,
    lightColor,
    darkColor,
    contentContainerStyle,
    ...otherProps
}: ThemedScrollViewProps) {
    const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

    return (
        <ScrollView
            style={[{ backgroundColor }, style]}
            contentContainerStyle={contentContainerStyle}
            {...otherProps}
        />
    );
}
