// src/Screens/Invoices/InvoicesScreen.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, NEUROMORPHIC } from '../../Constants/theme';
import InvoiceCard from '../../Components/Data/InvoiceCard';
import DataState from '../../Components/Data/DataSate';
import Button from '../../Components/Common/Button';
import { invoiceService } from '../../Services/invoiceService';
import { useAuth } from '../../Hooks/useAuth';

const InvoicesScreen = ({ navigation }) => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        loadInvoices();
    }, []);

    const loadInvoices = async () => {
        setLoading(true);
        setError('');
        const response = await invoiceService.getInvoices(user._id);
        if (response.success) {
            setInvoices(response.invoices);
        } else {
            setError(response.message);
        }
        setLoading(false);
    };

    // Función para renderizar el contenido correcto según el estado
    const renderContent = () => {
        if (loading) {
            return <DataState loading={loading} />;
        }
        if (error) {
            return <DataState error={error} onRetry={loadInvoices} />;
        }
        
        // VALIDACIÓN CLAVE: Si no hay facturas (no ha hecho compras)
        if (invoices.length === 0) {
            return (
                <View style={styles.emptyContainer}>
                    <View style={styles.emptyIconWrapper}>
                        <Ionicons name="document-text-outline" size={60} color={COLORS.primary} />
                    </View>
                    <Text style={styles.emptyTitle}>No hay facturas registradas</Text>
                    <Text style={styles.emptyText}>
                        Aún no tienes facturas generadas. Realiza tu primera compra en nuestro catálogo para ver tus recibos aquí.
                    </Text>
                    <Button 
                        title="Ir a Productos" 
                        onPress={() => navigation.navigate('Products')} 
                        size="medium"
                        style={styles.emptyButton}
                    />
                </View>
            );
        }

        // Si hay facturas, las mapeamos
        return invoices.map((invoice) => (
            <InvoiceCard
                key={invoice._id}
                invoice={invoice}
                onPress={() => navigation.navigate('InvoiceDetail', { invoiceId: invoice._id })}
            />
        ));
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.title}>Facturas</Text>
                <Text style={styles.subtitle}>Tus recibos de compra</Text>
                {renderContent()}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    scrollContent: { padding: 20, paddingBottom: 80 },
    title: { ...TYPOGRAPHY.heading, fontSize: 28, color: COLORS.textPrimary },
    subtitle: { ...TYPOGRAPHY.caption, fontSize: 14, color: COLORS.textSecondary, marginBottom: 20 },
    
    // Estilos para la pantalla de "Estado Vacío"
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
        marginTop: 20,
    },
    emptyIconWrapper: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.background,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        ...NEUROMORPHIC.outerShadow,
        ...NEUROMORPHIC.innerShadow,
    },
    emptyTitle: {
        ...TYPOGRAPHY.heading,
        fontSize: 20,
        color: COLORS.textPrimary,
        textAlign: 'center',
        marginBottom: 10,
    },
    emptyText: {
        ...TYPOGRAPHY.body,
        fontSize: 15,
        color: COLORS.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    emptyButton: {
        width: '80%',
        maxWidth: 250,
    }
});

export default InvoicesScreen;