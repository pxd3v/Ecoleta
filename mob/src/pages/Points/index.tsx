import React, { useState, useEffect, useMemo } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather as Icon } from '@expo/vector-icons';
import Constants from 'expo-constants';
import MapView, { Marker } from 'react-native-maps';
import { SvgUri } from 'react-native-svg';
import { ScrollView } from 'react-native-gesture-handler';
import useItems from '../../common/hooks/useItems'
import * as Location from 'expo-location';
import usePoints, {ColectPoint} from '../../common/hooks/usePoints';
import api from '../../services/api';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 20 + Constants.statusBarHeight,
  },

  title: {
    fontSize: 20,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 24,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 4,
    fontFamily: 'Roboto_400Regular',
  },

  mapContainer: {
    flex: 1,
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 16,
  },

  map: {
    width: '100%',
    height: '100%',
  },

  mapMarker: {
    width: 90,
    height: 80, 
  },

  mapMarkerContainer: {
    width: 90,
    height: 70,
    backgroundColor: '#34CB79',
    flexDirection: 'column',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center'
  },

  mapMarkerImage: {
    width: 90,
    height: 45,
    resizeMode: 'cover',
  },

  mapMarkerTitle: {
    flex: 1,
    fontFamily: 'Roboto_400Regular',
    color: '#FFF',
    fontSize: 13,
    lineHeight: 23,
  },

  itemsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 32,
  },

  item: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#eee',
    height: 120,
    width: 120,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'space-between',

    textAlign: 'center',
  },

  selectedItem: {
    borderColor: '#34CB79',
    borderWidth: 2,
  },

  itemTitle: {
    fontFamily: 'Roboto_400Regular',
    textAlign: 'center',
    fontSize: 13,
  },
});

export interface Item {
  id: number;
  name: string;
  image_url: string;
}

const Points = () => {
  const navigation = useNavigation();
  
  const handleNavigateBack = () => {
    navigation.goBack();
  }

  const handleNavigateToDetail = (id: number) => {
    navigation.navigate('Detail', { point_id: id});
  }

  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [initialPosition, setInitialPosition] = useState<[number ,number]>([0,0]);
  const [points, setPoints] = useState<ColectPoint[]>([])
  const handleSelectItem = (id: number) => {
    const alreadySelected = selectedItems.findIndex(i => i === id);
    if(alreadySelected > -1){
        const filteredItems = selectedItems.filter(i => i !== id);
        setSelectedItems(filteredItems);
    } else {
        setSelectedItems([ ...selectedItems, id]);
    }
  }
  const filters = useMemo(() => ({city:"Belo Horizonte", uf: "MG", items: selectedItems}), [selectedItems]);
  const items = useItems();

  useEffect(() => {
    const data = usePoints(filters);
    setPoints(data);
  }, [filters])
  

  useEffect(() => {
    async function loadPosition() {
      const { status } = await Location.requestPermissionsAsync();

      if(status !== 'granted') {
        Alert.alert('Ooops...', 'Precisamos de sua permissão para obter a localização.');
        return;
      }

      const location = await Location.getCurrentPositionAsync();
      const { latitude, longitude } = location.coords;
      setInitialPosition([latitude, longitude]);
    }

    loadPosition()
  }, [])

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleNavigateBack}>
            <Icon name="arrow-left" size={20} color="#34cb79"/>
        </TouchableOpacity>
        <Text style={styles.title}>Bem vindo.</Text>
        <Text style={styles.description}>Encontre no mapa um ponto de coleta.</Text>
        <View style={styles.mapContainer}>
          { initialPosition[0] !== 0 && 
            (<MapView 
            style={styles.map}
            initialRegion={{
              latitude: initialPosition[0], 
              longitude: initialPosition[1], 
              latitudeDelta: 0.014, 
              longitudeDelta: 0.014
            }}
          >
            {points.map(p => (
              <Marker
              key={String(p.id)}
              style={styles.mapMarker}
              onPress={() => handleNavigateToDetail(p.id)}
              coordinate={{
                latitude: p.latitude, 
                longitude: p.longitude, 
              }}
              >
                <View style={styles.mapMarkerContainer}>
                  <Image style={styles.mapMarkerImage} source={{ uri: p.image}}/>
                  <Text style={styles.mapMarkerTitle}>{p.name}</Text>
                </View>
              </Marker>
            ))}
          </MapView>)
          }
          
        </View>
      </View>

      <View style={styles.itemsContainer}>
        <ScrollView horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal:20
          }}>
            {items.map(i => (
              <TouchableOpacity 
              key={String(i.id)} 
              style={[styles.item, selectedItems.includes(i.id) ? styles.selectedItem : {}]} 
              onPress={() => {handleSelectItem(i.id)}} 
              activeOpacity={0.6}>
                <SvgUri width={42} height={42} uri={i.image_url} />
                <Text style={styles.itemTitle}>{i.name}</Text>
              </TouchableOpacity>
            ))}
        </ScrollView>
      </View>
    </>
  )
}

export default Points;