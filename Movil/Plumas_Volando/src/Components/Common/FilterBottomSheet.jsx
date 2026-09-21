import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, NEUROMORPHIC, TYPOGRAPHY } from '../../Constants/theme';
import Button from './Button';

const CATEGORIES = ['Todos', 'Huevos', 'Pollos', 'Gallinas', 'Alimento', 'Accesorios'];
const SORT_OPTIONS = [
    { label: 'Más Recientes', value: 'recent' },
    { label: 'Precio: Menor a Mayor', value: 'price_asc' },
    { label: 'Precio: Mayor a Menor', value: 'price_desc' },
    { label: 'Nombre: A - Z', value: 'name_asc' },
];

const FilterBottomSheet = ({ visible, onClose, onApply, initialFilters }) => {
    const [category, setCategory] = useState(initialFilters.category || 'Todos');
    const [minPrice, setMinPrice] = useState(initialFilters.minPrice || '');
    const [maxPrice, setMaxPrice] = useState(initialFilters.maxPrice || '');
    const [sort, setSort] = useState(initialFilters.sort || 'recent');

    const handleApply = () => {
        onApply({
            category: category === 'Todos' ? '' : category,
            minPrice: minPrice ? Number(minPrice) : '',
            maxPrice: maxPrice ? Number(maxPrice) : '',
            sort: sort === 'recent' ? '' : sort,
        });
    };

    const handleClear = () => {
        setCategory('Todos');
        setMinPrice('');
        setMaxPrice('');
        setSort('recent');
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.sheet}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Filtros y Orden</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close-circle" size={28} color={COLORS.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Text style={styles.label}>Categoría</Text>
                        <View style={styles.chipsContainer}>
                            {CATEGORIES.map((cat) => (
                                <TouchableOpacity
                                    key={cat}
                                    style={[styles.chip, category === cat && styles.chipActive]}
                                    onPress={() => setCategory(cat)}
                                >
                                    <Text style={[styles.chipText, category === cat && styles.chipTextActive]}>
                                        {cat}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={styles.label}>Rango de Precio ($)</Text>
                        <View style={styles.priceRow}>
                            <View style={styles.priceInputWrapper}>
                                <TextInput
                                    style={styles.priceInput}
                                    placeholder="Mín"
                                    keyboardType="numeric"
                                    value={minPrice}
                                    onChangeText={setMinPrice}
                                    placeholderTextColor={COLORS.textMuted}
                                />
                            </View>
                            <Text style={styles.priceSeparator}>a</Text>
                            <View style={styles.priceInputWrapper}>
                                <TextInput
                                    style={styles.priceInput}
                                    placeholder="Máx"
                                    keyboardType="numeric"
                                    value={maxPrice}
                                    onChangeText={setMaxPrice}
                                    placeholderTextColor={COLORS.textMuted}
                                />
                            </View>
                        </View>

                        <Text style={styles.label}>Ordenar por</Text>
                        <View style={styles.sortContainer}>
                            {SORT_OPTIONS.map((option) => (
                                <TouchableOpacity
                                    key={option.value}
                                    style={[styles.sortOption, sort === option.value && styles.sortOptionActive]}
                                    onPress={() => setSort(option.value)}
                                >
                                    <Ionicons 
                                        name={sort === option.value ? "radio-button-on" : "radio-button-off"} 
                                        size={20} 
                                        color={sort === option.value ? COLORS.primary : COLORS.textSecondary} 
                                    />
                                    <Text style={[styles.sortText, sort === option.value && styles.sortTextActive]}>
                                        {option.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>

                    <View style={styles.actions}>
                        <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
                            <Text style={styles.clearText}>Limpiar</Text>
                        </TouchableOpacity>
                        <View style={{ flex: 2, marginLeft: 12 }}>
                            <Button title="Aplicar Filtros" onPress={handleApply} size="medium" />
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
    sheet: {
        backgroundColor: COLORS.background,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 24,
        paddingBottom: 40,
        maxHeight: '85%',
        ...NEUROMORPHIC.topShadow,
    },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    title: { ...TYPOGRAPHY.heading, fontSize: 20, color: COLORS.textPrimary },
    label: { fontSize: 14, fontWeight: '700', color: COLORS.textSecondary, marginBottom: 10, marginTop: 16 },
    
    chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    chip: {
        paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
        backgroundColor: COLORS.background, ...NEUROMORPHIC.flat,
    },
    chipActive: { backgroundColor: COLORS.primary, ...NEUROMORPHIC.bottomShadow },
    chipText: { fontSize: 13, fontWeight: '600', color: COLORS.textPrimary },
    chipTextActive: { color: COLORS.textLight },

    priceRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    priceInputWrapper: { flex: 1, backgroundColor: COLORS.background, borderRadius: 14, ...NEUROMORPHIC.inset, borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)' },
    priceInput: { padding: 14, fontSize: 15, color: COLORS.textPrimary, fontWeight: '600' },
    priceSeparator: { color: COLORS.textSecondary, fontWeight: '600' },

    sortContainer: { gap: 10 },
    sortOption: {
        flexDirection: 'row', alignItems: 'center', padding: 14,
        backgroundColor: COLORS.background, borderRadius: 14, ...NEUROMORPHIC.flat,
    },
    sortOptionActive: { ...NEUROMORPHIC.bottomShadow, borderWidth: 1, borderColor: 'rgba(138,90,0,0.2)' },
    sortText: { marginLeft: 12, fontSize: 14, color: COLORS.textPrimary, fontWeight: '500' },
    sortTextActive: { color: COLORS.primary, fontWeight: '700' },

    actions: { flexDirection: 'row', marginTop: 24, alignItems: 'center' },
    clearButton: { flex: 1, padding: 14, alignItems: 'center', borderRadius: 14, backgroundColor: COLORS.background, ...NEUROMORPHIC.flat },
    clearText: { color: COLORS.error, fontWeight: '700', fontSize: 15 },
});

export default FilterBottomSheet;