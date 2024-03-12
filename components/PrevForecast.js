import { View, Text, FlatList } from 'react-native'

import firestore from '@react-native-firebase/firestore';
import { useEffect, useState } from 'react';
const PrevForecast = () => {
    //  useEffect(()=>{
    //   const getData = async ()=>{
    //     const userDocument = await firestore().collection('forecast').get()
    //     console.log("User Loc",userDocument.docs[0].data)
    //   } 
    // }, [])
    const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [users, setUsers] = useState([]);
    useEffect(() => {
      const subscriber = firestore()
        .collection('forecast')
        .onSnapshot(querySnapshot => {
          const users = [];
    
          querySnapshot.forEach(documentSnapshot => {
            users.push({
              ...documentSnapshot.data(),
              key: documentSnapshot.id,
            });
          });
    
          setUsers(users);
          setLoading(false);
        });
    
      // Unsubscribe from events when no longer in use
      return () => subscriber();
    }, []);
    console.log(users)
  return (
    <View className='flex-1 relative' style={{ backgroundColor: '#393027' }}>
  
  <FlatList 
      data={users}
      renderItem={({ item }) => (
        <View style={{ backgroundColor: '#221910' }}
          className='flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4 '>
          <Text className='text-white ' > {item.recentloc}</Text>
          <Text className='text-white text-xl font-semibold '>{item.estimatedtemp}</Text>
        </View>
      )}
    />
    </View>
  )
}

export default PrevForecast 