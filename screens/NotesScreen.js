import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import NoteItem from '../components/NoteItem';
import * as Sharing from 'expo-sharing';

const STORAGE_KEY = '@photo_notes';

export default function NotesScreen({ navigation, route }) {
    const [notes, setNotes] = useState([]);
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            loadNotes();
        }
    }, [isFocused]);

    useEffect(() => {
        const addNote = async () => {
            if (route.params?.imageUri) {
                const saved = await AsyncStorage.getItem(STORAGE_KEY);
                const existingNotes = saved ? JSON.parse(saved) : [];

                const newNote = {
                    id: Date.now().toString(),
                    imageUri: route.params.imageUri,
                    text: route.params?.noteText || '',
                    createdAt: new Date().toISOString()
                };

                const updated = [newNote, ...existingNotes];
                setNotes(updated);
                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

                navigation.setParams({ imageUri: null, noteText: null });
            }
        };

        addNote();
    }, [route.params?.imageUri]);

    async function loadNotes() {
        try {
            const saved = await AsyncStorage.getItem(STORAGE_KEY);
            if (saved) {
                setNotes(JSON.parse(saved));
            }
        } catch (error) {
            console.log('Error loading notes:', error);
        }
    }

    async function saveNotes(data) {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (error) {
            console.log('Error saving notes:', error);
        }
    }

    function handleDelete(id) {
        const filtered = notes.filter((note) => note.id !== id);
        setNotes(filtered);
        saveNotes(filtered);
    }

    function handleEdit(id, newText) {
        const updated = notes.map((note) => {
            if (note.id === id) {
                return { ...note, text: newText };
            }
            return note;
        });
        setNotes(updated);
        saveNotes(updated);
    }

    const handleShare = async (imageUri) => {
        try {
            const available = await Sharing.isAvailableAsync();
            if (!available) {
                alert('Sharing is not available on this device');
                return;
            }
            await Sharing.shareAsync(imageUri);
        } catch (error) {
            console.log('Error while sharing:', error);
        }
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={notes}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <NoteItem
                        note={item}
                        onDelete={() => handleDelete(item.id)}
                        onEdit={(newText) => handleEdit(item.id, newText)}
                        onShare={() => handleShare(item.imageUri)}
                    />
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>No notes yet</Text>}
            />

            <TouchableOpacity
                style={styles.cameraButton}
                onPress={() => navigation.navigate('Camera')}
            >
                <Text style={styles.cameraButtonText}>📷 Add Photo</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f8f8f8',
    },
    cameraButton: {
        backgroundColor: '#FF7F50',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    cameraButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#777',
    },
});
