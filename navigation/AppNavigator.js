import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NotesScreen from '../screens/NotesScreen';
import CameraScreen from '../screens/CameraScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="Notes"
                    component={NotesScreen}
                    options={{ title: 'Notes' }}
                />
                <Stack.Screen
                    name="Camera"
                    component={CameraScreen}
                    options={{ title: 'Camera' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
