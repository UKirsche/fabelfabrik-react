import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Modal, Pressable } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Styles } from '../constants/Styles';
import { Colors } from '../constants/Colors';

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
        { title: 'Geschichten', path: '/stories' },
        { title: 'Hintergrund und Motivation', path: '/motivation' },
        { title: 'KI und Rechtliches', path: '/rechte_ki' },
        { title: 'Entwickler', path: '/entwickler' },
        { title: 'Impressum', path: '/impressum' },
    ];

    return (
        <View style={Styles.menu.container}>
            <TouchableOpacity onPress={toggleMenu} style={Styles.menu.button}>
                <Ionicons name="menu" size={28} color="white" />
            </TouchableOpacity>

            <Modal
                animationType="fade"
                transparent={true}
                visible={menuVisible}
                onRequestClose={closeMenu}
            >
                <Pressable style={Styles.menu.modalOverlay} onPress={closeMenu}>
                    <View style={Styles.menu.menuContainer}>
                        <View style={Styles.menu.menu}>
                            <View style={Styles.menu.menuHeader}>
                                <Text style={Styles.text.menuTitle}>Menü</Text>
                                <TouchableOpacity onPress={closeMenu}>
                                    <Ionicons name="close" size={24} color={Colors.light.paragraphText} />
                                </TouchableOpacity>
                            </View>

                            {menuItems.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        Styles.menu.menuItem,
                                        pathname === item.path && Styles.menu.activeMenuItem
                                    ]}
                                    onPress={() => navigateTo(item.path)}
                                >
                                    <Text 
                                        style={[
                                            Styles.text.menuItem,
                                            pathname === item.path && Styles.text.activeMenuItem
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

