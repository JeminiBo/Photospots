import firebaseAuth from '@react-native-firebase/auth';
import functions, { firebase } from '@react-native-firebase/functions';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { firebase as firebaseAppcheck } from '@react-native-firebase/app-check';

let rnfbProvider = firebaseAppcheck
  .appCheck()
  .newReactNativeFirebaseAppCheckProvider();
rnfbProvider.configure({
  android: {
    provider: __DEV__ ? 'debug' : 'playIntegrity',
    debugToken: 'B3D34113-95E0-4FDF-8CE4-C3DAA8CAEBD3',
  },
  apple: {
    provider: __DEV__ ? 'debug' : 'appAttestWithDeviceCheckFallback',
    debugToken: '4030A6C8-12D0-47E4-8B0D-2DDB738727C3',
  },
  web: {
    provider: 'reCaptchaV3',
    siteKey: 'unknown',
  },
});

if (__DEV__) {
  firebase.functions().useEmulator('localhost', 5001);
}

class Firebase {
  checkAppCheck = async () => {
    firebase.appCheck().initializeAppCheck({
      provider: rnfbProvider,
      isTokenAutoRefreshEnabled: true,
    });

    try {
      const { token } = await firebase.appCheck().getToken(true);

      if (token.length > 0) {
        console.log('AppCheck verification passed');
      }
    } catch (error) {
      console.log('AppCheck verification failed');
    }
  };

  auth = () => {
    return firebaseAuth()
      .signInAnonymously()
      .then((data) => {
        console.log('AUTH SUCCESS', data.user.uid);
        return data.user.uid;
      })
      .catch((error) => {
        console.error(error);
      });
  };

  signOut = () => {
    firebaseAuth()
      .signOut()
      .then(() => {
        console.log('SIGN OUT');
      })
      .catch((error) => {
        console.error(error);
      });
  };

  addRoleToUser = async (uid, role) => {
    await functions().httpsCallable('addRole')({
      uid,
      role,
    });
    await this.isUserHaveRole(role);
  };

  isUserHaveRole = async (roleName) => {
    const idTokenResult = await firebase
      .auth()
      .currentUser.getIdTokenResult(true);
    return idTokenResult.claims[roleName];
  };

  getAllDataFromDb = async (collectionName) => {
    return await firestore()
      .collection(collectionName)
      .get()
      .then((snapshot) => {
        const newData = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        return newData;
      });
  };

  getImageUrl = async (
    imageName = 'Screenshot from 2023-05-07 12-28-30.png',
  ) => {
    const url = await storage().ref(imageName).getDownloadURL();
    return url;
  };
}

export const FirebaseService = new Firebase();
