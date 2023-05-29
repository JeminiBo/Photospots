import React, { useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  useColorScheme,
} from 'react-native';
import { withIAPContext } from 'react-native-iap';
import SplashScreen from 'react-native-splash-screen';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { FirebasePage } from './src/pages/firebase';
import { Purchase } from './src/pages/purchase';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <FirebasePage />
      </ScrollView>
    </SafeAreaView>
  );
}

export default withIAPContext(App);
