import { useState } from 'react';
import { ScrollView, Button, View, Text } from 'react-native';
import { FirebaseService } from '../../services/firebaseService';

const FirebasePage = () => {
  const [uid, setUid] = useState(null);
  const [locations, setLocations] = useState([]);
  console.log('LOCATIONS', locations);
  return (
    <ScrollView style={{}}>
      <Button
        title="Auth"
        onPress={async () => {
          const userUid = await FirebaseService.auth();
          setUid(userUid);
        }}
      />
      <Button
        title="Add subscriber permission"
        onPress={async () => {
          await FirebaseService.checkAppCheck();
          await FirebaseService.addRoleToUser(uid, 'subscriber');
        }}
      />
      <Button
        title="Is Subscriber"
        onPress={async () => {
          const isRole = await FirebaseService.isUserHaveRole('subscriber');
          console.log('IS SUBSCRIBER', isRole);
        }}
      />
      <Button
        title="Get DB data"
        onPress={async () => {
          const locations = await FirebaseService.getAllDataFromDb('locations');
          setLocations(locations);
        }}
      />
      <Button title="SignOut" onPress={() => FirebaseService.signOut()} />
      <View>
        <Text style={{ marginTop: 40, marginBottom: 20 }}>LOCATIONS</Text>
        {locations.map((location) => (
          <Button
            key={location.id}
            title={location?.id || 'No name'}
            onPress={async () => {
              console.log('REF', location);
              location.Spots.forEach(async (spot) => {
                const spotDetails = await spot.SpotRef.get();
                console.log('Spot Details', spotDetails.data());
              });
            }}
          />
        ))}
      </View>
    </ScrollView>
  );
};

export { FirebasePage };
