import { View, Text, Image, StatusBar, SafeAreaView, TextInput, TouchableOpacity, ScrollView, PermissionsAndroid } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import PrevForecast from './PrevForecast'
import { debounce } from 'lodash';
import { fetchLocations, fetchWeatherForecast } from '../api/Weather';
import Geolocation from '@react-native-community/geolocation';
import firestore from '@react-native-firebase/firestore';
const HomeScreen = ({ navigation }) => {
  const [showSearch, setshowSearch] = useState(false);
  const [locations, setLocation] = useState([]);
  const [weather, setWeather] = useState({});
  const [user, setuser] = useState([]);
  var myArray = []
  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          'title': 'Example App',
          'message': 'Example App access to your location '
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the location")
        alert("You can use the location");
        getLocation();
      } else {
        console.log("location permission denied")
        alert("Location permission denied");
      }
    } catch (err) {
      console.warn(err)
    }
  };
  const getLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        console.log("pos", position);
      },
      (error) => {
        // See error code charts below.
        console.log(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }

  const handleSearch = value => {     //For searching Cities
    if (value.length > 2) {              //if search baar letters is > 2
      fetchLocations({ cityName: value }).then(data => {
        setLocation(data);
        console.log("Search" , user)
      })
    }
  }
  
  const ReturnID = async () => {
    try {
        const querySnapshot = await firestore()
            .collection('forecast')
            .doc(location?.name)
            .collection('weather')
            .get();

        const users = querySnapshot.docs.map(doc => ({
          // ...documentSnapshot.data(),  
            ...doc.data(), 
          // key: documentSnapshot.id,         
            key: doc.id,
        }));                 

        const ID =  users.length;
         console.log("Users",ID)
        setuser(users);
        myArray.push(...users);
        console.log("function call");
    console.log("Location Data" , user)
        return ID ;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null; // Or handle the error appropriately
    }
};
// const users = [];
  useEffect(() => {         // fetch weather firstly when you start
    fetchmyweatherdata()  
      
    // const subscriber  =  firestore()
    // .collection('forecast').doc(location?.name).collection('weather')
    // .onSnapshot(querySnapshot => {
      
    //   querySnapshot.forEach(documentSnapshot => {
    //     users.push({
    //       ...documentSnapshot.data(),
    //       key: documentSnapshot.id,
    //     });
    //     console.log("ID", documentSnapshot.id)
    //     // console.log("data", users)    
    //     documentID = documentSnapshot.id;
    //     // data = users
    //       // setuser(users) 
    //   });
    //   console.log("data", users)    //data is showing here
    //   // console.log("Users", data);  // users.length > 7 then delete index 0 data
      
    // });
    ReturnID()
  }, []);

  const fetchmyweatherdata = async () => {   // for starting an app
    fetchWeatherForecast({
      cityName: 'Lahore'
    }).then(data => {
      setWeather(data)
    })
  }
  const handleloc = (loc) => {
    console.log('location :', loc);
    setLocation([]);
    setshowSearch(false);
    fetchWeatherForecast({   // fethching forecast
      cityName: loc.name,
      days: '7'
    }).then(data => {
      setWeather(data);
      addPrevLoc(data)  // Saving data from api
      console.log('got data', data?.location?.localtime.split(" ")[0])
    })
    ReturnID()
  }
  const handleTextdebounce = useCallback(debounce(handleSearch, 1200), []);   // debounce is used for for get request to api after writing one letter
  const { current, location } = weather;   // Geting data from api
  const addPrevLoc = async (loc) => {
    // const number = Math.floor(Math.random() * 10);
    // if (isNaN(num) || num < 1 || num >= 7) {
    //   num = 1;
    // } else {
    //   num++;
    //   if (num >= 7) {
    //     num = 1; // Reset to 1 if num reaches 7
    //   }
    // }
    // console.log("Num111:", myArray);
  // }
    const newloc = firestore().collection("forecast").doc(loc?.location?.name).collection('weather').doc(( ReturnID() + 1).toString()).set({
  
      recentloc: loc.location.name,                       // location.name 
      estimatedtemp: loc.current.temp_c,
      Date: loc?.location?.localtime.split(" ")[0]        
                 //
    }).catch((err)=>{
      alert(err);
    
    })
    console.log("data set");
    console.log("Users",ReturnID())
  }
  return (
    <View className='flex-1 relative' style={{ backgroundColor: '#393027' }} >
      <StatusBar style="light" />
      <SafeAreaView className='flex flex-1' >

        <View style={{ height: '7' }} className='mx-4 relative z-50' >
          <View className='flex-row justify-end items-center rounded-full mt-3'
            style={{ backgroundColor: showSearch ? '#221910' : 'transparent' }}>

            {showSearch ?
              <TextInput
                onChangeText={handleTextdebounce}
                placeholder='Search City'
                placeholderTextColor={'white'}
                className='pl-2  h-10 flex-1 text-base text-white'></TextInput>
              : null}
            <TouchableOpacity onPress={() => setshowSearch(!showSearch)} style={{ backgroundColor: '#221910' }}
              className='rounded-full p-3 m-1 ' >
              <Image source={require('../assets/search1.png')} />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ backgroundColor: '#221910' }}
              className='rounded-full p-3 '
              onPress={() => navigation.navigate('PrevForecast', { selectedcity: location?.name })} >
              <Image source={require('../assets/bar-chart.png')} /></TouchableOpacity>
          </View>
          {locations.length > 0 && showSearch ? (
            <View className='absolute w-full bg-gray-300 top-16 rounded-3xl ' >
              {locations.map((loc, index) => {
                return (
                  <TouchableOpacity
                    onPress={() => handleloc(loc)}
                    key={index} loc
                    className={'flex-row items-center border-0 p-3 px-2 '}>
                    <Image className='h-7 w-7' source={require('../assets/location.png')} />
                    <Text className='text-black text-lg ' >{loc?.name}.{loc?.country}</Text>
                  </TouchableOpacity>
                )
              })}
            </View>) : null
          }

        </View>
        {/* // new sec   */}
        <View className='mx-4 flex justify-around flex-1 mb-2' >
          <Text className='text-white text-center text-2xl font-bold' >
            {location?.name}

            <Text className='text-lg font-semibold text-gray-300' >
              {" " + location?.country}
            </Text>
          </Text>

          <View className='flex-row justify-center'>
            <Image source={{ uri: 'https:' + current?.condition?.icon }}
              className='h-52 w-52'></Image>
          </View>
          <View className='space-y-2' >
            <Text className="text-center font-bold text-white text-6xl ml-5" >
              {current?.temp_c}&#176;
            </Text>
            <Text className="text-center text-white text-xl ">
              {current?.condition.text}
            </Text>
          </View>
          <View className='flex-row justify-between mx-4' >
            <View className='flex-row space-x-2 items-center' >
              <Image source={require('../assets/wind1.png')} className='h-7 w-7 ' />
              <Text className='text-white  text-base' >
                {current?.wind_kph}kmh
              </Text>
            </View>
            <View className='flex-row space-x-2 items-center' >
              <Image source={require('../assets/humidity.png')} className='h-7 w-7 ' />
              <Text className='text-white  text-base' >
                {current?.humidity}%
              </Text>
            </View>
            <View className='flex-row space-x-2 items-center' >
              <Image source={require('../assets/sun.png')} className='h-7 w-7' />
              <Text className='text-white text-base' >
                {weather?.forecast?.forecastday[0]?.astro?.sunrise}
              </Text>
            </View>
          </View>
        </View>
        <View className='mb-2 space-y-3 ' >
          <View className="flex-row items-center mx-2 space-x-2" >
            <Image source={require('../assets/calendar.png')} ></Image>
            <Text className='text-white text-base' >Daily forecast</Text>
          </View>
          <ScrollView
            horizontal
            contentContainerStyle={{ paddingHorizontal: 15 }}
            showsHorizontalScrollIndicator={false}
          >
            {
              weather?.forecast?.forecastday?.map((item, index) => {
                return (
                  <View
                    key={index}
                    className='flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4'
                    style={{ backgroundColor: '#221910' }}
                  >
                    <Image source={require('../assets/cloudy.png')} className='h-11 w-11' />
                    <Text className='text-white' >{item?.date}</Text>
                    <Text className='text-white text-xl font-semibold' > {item?.day?.avgtemp_c}&#176;</Text>
                  </View>
                )
              })
            }
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  )
}

export default HomeScreen