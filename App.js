import { View, Text, Image, StatusBar, SafeAreaView, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { debounce } from 'lodash'
import { fetchLocations, fetchWeatherForecast } from './api/Weather';
const App = () => {
  const [showSearch, setshowSearch] = useState(false);
  const [locations, setLocation] = useState([]);
  const [weather, setWeather] = useState({});


  const handleSearch = value => {     //For searching Cities
    if (value.length > 2) {              //if search baar letters is > 2
      fetchLocations({ cityName: value }).then(data => {
        setLocation(data);
      })
    }
  }

  useEffect(() => {         // fetch weather firstly when you start
    fetchmyweatherdata()
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
      setWeather(data);   // Saving data from api
      console.log('got data', data)
    })
  }
  const handleTextdebounce = useCallback(debounce(handleSearch, 1200), []);   // debounce is used for for get request to api after writing one letter
  const { current, location } = weather;   // Geting data from api 
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
                className='pl-6  h-10 flex-1 text-base text-white'></TextInput>
              : null}

            <TouchableOpacity onPress={() => setshowSearch(!showSearch)} style={{ backgroundColor: '#221910' }}
              className='rounded-full p-3 m-1 ' >
              <Image source={require('./assets/search1.png')} />
            </TouchableOpacity>
          </View>
          {locations.length > 0 && showSearch ? (
            <View className='absolute w-full bg-gray-300 top-16 rounded-3xl ' >
              {locations.map((loc, index) => {
                return (
                  <TouchableOpacity
                    onPress={() => handleloc(loc)}
                    key={index}
                    className={'flex-row items-center border-0 p-3 px-2 '}>
                    <Image className='h-7 w-7' source={require('./assets/location.png')} />
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
              <Image source={require('./assets/wind1.png')} className='h-7 w-7 ' />
              <Text className='text-white  text-base' >
                {current?.wind_kph}kmh
              </Text>
            </View>
            <View className='flex-row space-x-2 items-center' >
              <Image source={require('./assets/humidity.png')} className='h-7 w-7 ' />
              <Text className='text-white  text-base' >
                {current?.humidity}%
              </Text>
            </View>
            <View className='flex-row space-x-2 items-center' >
              <Image source={require('./assets/sun.png')} className='h-7 w-7' />
              <Text className='text-white text-base' >
                {weather?.forecast?.forecastday[0]?.astro?.sunrise}
              </Text>
            </View>
          </View>
        </View>


        <View className='mb-2 space-y-3 ' >
          <View className="flex-row items-center mx-2 space-x-2" >
            <Image source={require('./assets/calendar.png')} ></Image>
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
                    <Image source={require('./assets/cloudy.png')} className='h-11 w-11' />
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
export default App