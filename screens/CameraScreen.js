import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Cumera from '../components/Cumera';

export default function CameraScreen({ navigation }) {
    const [noteText, setNoteText] = useState('');

    const handlePictureTaken = (uri) => {
        navigation.replace('Notes', {
            imageUri: uri,
            noteText: noteText,
        });
    };

    return (
        <View style={{ flex: 1 }}>
            <Cumera onPictureTaken={handlePictureTaken} />
            <TextInput
                style={styles.input}
                placeholder="Enter note text..."
                value={noteText}
                onChangeText={setNoteText}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    input: {
        position: 'absolute',
        bottom: 100,
        left: 20,
        right: 20,
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
    },
});
