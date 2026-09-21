import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, NEUROMORPHIC } from '../../Constants/theme';

const SearchBar = ({ value, onChangeText, placeholder }) => {
    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <Ionicons name="search-outline" size={20} color={COLORS.textSecondary} />
            </View>
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder || "Buscar productos..."}
                placeholderTextColor={COLORS.textMuted}
                autoCapitalize="none"
                autoCorrect={false}
                clearButtonMode="while-editing"
            />
            {value.length > 0 && (
                <TouchableOpacity onPress={() => onChangeText('')} style={styles.clearIcon}>
                    <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.background,
        borderRadius: 18,
        paddingHorizontal: 16,
        height: 54,
        marginBottom: 16,
        ...NEUROMORPHIC.inset,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.4)',
    },
    iconContainer: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: COLORS.textPrimary,
        fontWeight: '500',
        paddingVertical: 0,
    },
    clearIcon: {
        padding: 4,
    }
});

export default SearchBar;