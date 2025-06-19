import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Modal, Pressable } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function HamburgerMenu() {
    const [menuVisible, setMenuVisible] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
    };

    const closeMenu = () => {
        setMenuVisible(false);
    };

    const navigateTo = (path) => {
        router.push(path);
        closeMenu();
    };

    const menuItems = [
        { title: 'Startseite', path: '/' },
        { title: 'Hintergrund und Motivation', path: '/motivation' },
        { title: 'KI und Rechtliches', path: '/rechte_ki' },
        { title: 'Entwickler', path: '/entwickler' },
    ];

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
                <Ionicons name="menu" size={28} color="white" />
            </TouchableOpacity>

            <Modal
                animationType="fade"
                transparent={true}
                visible={menuVisible}
                onRequestClose={closeMenu}
            >
                <Pressable style={styles.modalOverlay} onPress={closeMenu}>
                    <View style={styles.menuContainer}>
                        <View style={styles.menu}>
                            <View style={styles.menuHeader}>
                                <Text style={styles.menuTitle}>Menü</Text>
                                <TouchableOpacity onPress={closeMenu}>
                                    <Ionicons name="close" size={24} color="#333" />
                                </TouchableOpacity>
                            </View>

                            {menuItems.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.menuItem,
                                        pathname === item.path && styles.activeMenuItem
                                    ]}
                                    onPress={() => navigateTo(item.path)}
                                >
                                    <Text 
                                        style={[
                                            styles.menuItemText,
                                            pathname === item.path && styles.activeMenuItemText
                                        ]}
                                    >
                                        {item.title}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        zIndex: 1000,
    },
    menuButton: {
        padding: 8,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    menuContainer: {
        width: '70%',
        height: '100%',
        backgroundColor: 'white',
    },
    menu: {
        flex: 1,
        padding: 20,
    },
    menuHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    menuTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1d5264',
    },
    menuItem: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    activeMenuItem: {
        backgroundColor: '#f0f8ff',
    },
    menuItemText: {
        fontSize: 16,
        color: '#333',
    },
    activeMenuItemText: {
        color: '#1d5264',
        fontWeight: 'bold',
    },
});
