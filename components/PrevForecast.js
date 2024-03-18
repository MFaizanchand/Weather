import { View, Text, FlatList, Dimensions, Alert } from 'react-native'
import firestore from '@react-native-firebase/firestore';
import { useEffect, useState } from 'react';
import {
  LineChart,

} from "react-native-chart-kit";
const PrevForecast = ({ route }) => {
  const selectedcity = route.params.selectedcity;
  console.log("selected city", route.params.selectedcity)
  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [users, setUsers] = useState([]);
  // const Delete = () => {
  //   if (selected.length > 7) {
  //     // Delete data from Firestore
  //     // firestore.collection("firestore").doc(selectedcity).collection('weather').Delete()
  //     //   .then(() => {
  //     //     Alert.alert("Data deleted successfully")
  //     //   })
  //     //   .catch((error) => {
  //     //     console.error("Error deleting data: ", error);
  //     //     Alert.alert("Failed to delete data");
  //     //   });
  //   } else {
  //     // Alert the user that the selected items are not sufficient for deletion
  //     Alert.alert("Selected items are not greater than 7. Cannot delete data.");
  //   }
  // }

  useEffect(() => {
    const subscriber = firestore()
      .collection('forecast').doc(selectedcity).collection('weather')
      .onSnapshot(querySnapshot => {
        const users = [];
        querySnapshot.forEach(documentSnapshot => {
          users.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
        console.log("Users", users);
        setUsers(users);
        setLoading(false);



      });
    // Unsubscribe from events when no longer in use

    return () => subscriber();
  }, []);
  var estimate = []
  var temp_date = []
  users.map((res, i) => {
    temp_date.push(res?.Date);
    estimate.push(res?.estimatedtemp);
    console.log("temp", estimate.length)
    console.log("date", temp_date.length)
  })

  return (
    <View className='flex-1 relative' style={{ backgroundColor: '#393027' }}>
      {/* <FlatList
        data={users}
        renderItem={({ item }) => (
          <View style={{ backgroundColor: '#221910' }}
          className='flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4 '>
            <Text className='text-white ' > {item.recentloc}</Text>
            <Text className='text-white text-xl font-semibold '>{item.estimatedtemp}</Text>
            <Text className='text-white'>{item.Date}</Text>
            <View style={{ flex: 1 }} >
            </View>
          </View>
        )}
      /> */}
      {estimate.length > 0 ? (<LineChart
        data={{
          labels: temp_date
          //  [12 , 13 , 14 , 15 , 16]
          , datasets: [
            {
              data:
                estimate
              //  [] 
              // [  Math.random() * 100,               
              //   Math.random() * 100,  
              //   Math.random() * 100,   
              //   Math.random() * 100,        
              //   Math.random() * 100,  
              //   Math.random() * 100 
              // ]
            }
          ]
        }}
        width={Dimensions.get("window").width} // from react-native
        height={220}
        yAxisLabel=""
        yAxisSuffix=""
        yAxisInterval={1} // optional, defaults to 1
        chartConfig={{
          backgroundColor: "yellow",
          backgroundGradientFrom: "black",
          backgroundGradientTo: "#fff",
          decimalPlaces: 2, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16
          },
          propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#ffa726"
          }
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16
        }}
      />) : null}

    </View>
  )
}

export default PrevForecast