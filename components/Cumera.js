import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';

export default function Cumera({ onPictureTaken }) {
    const [permission, requestPermission] = useCameraPermissions();
    const [mediaPermission, setMediaPermission] = useState(null);
    const [facing, setFacing] = useState('back');
    const cameraRef = useRef(null);
    const [isTakingPicture, setIsTakingPicture] = useState(false);

    useEffect(() => {
        (async () => {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            setMediaPermission(status === 'granted');
        })();
    }, []);

    if (!permission || !permission.granted) {
        return (
            <View style={styles.centered}>
                <Text>No access to camera</Text>
                <TouchableOpacity style={styles.button} onPress={requestPermission}>
                    <Text style={styles.text}>Grant access</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const toggleCameraFacing = () => {
        setFacing((prev) => (prev === 'back' ? 'front' : 'back'));
    };

    const takePhoto = async () => {
        if (!cameraRef.current || isTakingPicture) return;
        setIsTakingPicture(true);

        try {
            const photo = await cameraRef.current.takePictureAsync();

            if (mediaPermission) {
                const asset = await MediaLibrary.createAssetAsync(photo.uri);
                onPictureTaken && onPictureTaken(asset.uri);
            }
        } catch (err) {
            console.error('Error taking photo:', err);
        }

        setIsTakingPicture(false);
    };

    return (
        <View style={styles.container}>
            <CameraView
                ref={cameraRef}
                style={styles.camera}
                facing={facing}
            />
            <View style={styles.controls}>
                <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                    <Text style={styles.text}>🔄</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={takePhoto}>
                    {isTakingPicture ? (
                        <ActivityIndicator color="#000" />
                    ) : (
                        <Text style={styles.text}>📸</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    camera: {
        flex: 1,
    },
    controls: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    button: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 30,
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
});
