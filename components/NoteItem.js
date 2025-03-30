import React, { useState } from 'react';
import { View, Text, Image, Button, StyleSheet, TextInput } from 'react-native';

export default function NoteItem({ note, onDelete, onEdit, onShare }) {
    const [editing, setEditing] = useState(false);
    const [text, setText] = useState(note.text);

    function handleSave() {
        setEditing(false);
        onEdit(text);
    }

    return (
        <View style={styles.noteItem}>
            {note.imageUri && (
                <Image source={{ uri: note.imageUri }} style={styles.noteImage} />
            )}

            {editing ? (
                <TextInput
                    style={styles.input}
                    value={text}
                    onChangeText={setText}
                    onSubmitEditing={handleSave}
                    returnKeyType="done"
                    placeholder="Enter note text..."
                />
            ) : (
                <Text style={styles.noteText}>{note.text}</Text>
            )}

            <View style={styles.buttonRow}>
                {editing ? (
                    <Button title="Save" onPress={handleSave} />
                ) : (
                    <>
                        <Button title="Delete" onPress={onDelete} />
                        <Button title="Edit" onPress={() => setEditing(true)} />
                        <Button title="Share" onPress={onShare} />
                    </>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    noteItem: {
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
        elevation: 4,
    },
    noteImage: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 12,
    },
    noteText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 12,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        marginBottom: 12,
        backgroundColor: '#f9f9f9',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});
