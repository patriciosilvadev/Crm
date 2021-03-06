import React,{ useState, useEffect, createRef, useRef} from 'react';
import { View, FlatList, AppState } from 'react-native';
import { FAB, Appbar, Button, TextInput, List, TouchableRipple } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import BottomSheet from 'reanimated-bottom-sheet';
import moment from 'moment';
import Snackbar from 'react-native-snackbar';
import _ from 'lodash';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'; 
import { useDispatch } from 'react-redux';
import { Seperator, ActivityItem } from '../../custom';
import styles from './styles';
import { handleError } from '.././../lib/util';
import { setPrivateChannel, setChannel } from '../../actions/channelActions';

const Channels = (props) => {
    const [channels, setChannels] = useState([]);
    const [channel, setChanel] = useState("");
    const [loading, setLoading] = useState(false);
    const db = firestore();
    const bs = createRef();
    const Tab = createMaterialTopTabNavigator();
    const dispatch = useDispatch();

    const handlePress = () => {
        dispatch(setPrivateChannel(false));
     //   dispatch(setChannel(props.channel));
        props.navigation.navigate('ChatWindow');
    }

    useEffect(()=>{
        fetchChannels();
    },[]);

    const createChannel = () => {
        db.collection('channels').add({ name: channel, createdBy:  auth().currentUser.uid,  createdAt: moment().format(), updatedAt: moment().format() });
        db.collection('activities').add({
            event: `Created ${channel} channel`,
            createdAt: moment().format(),
            userId: auth().currentUser.uid,
        });
        Snackbar.show({
            text: `${channel} channel successfully created.`,
            duration: Snackbar.LENGTH_SHORT,
          });
          setChanel("");
        bs.current.snapTo(1);
    }


    const fetchChannels = async () => {
        try {
            setLoading(true);
            let results = [];
            querySnapshot = await db
                .collection('channels')
                .where('createdBy', '==', auth().currentUser.uid)
                .onSnapshot((querySnapshot) => {
                    const results = [];
                    querySnapshot.forEach((doc) => {
                        results.push(doc.data());
                    });
                    console.log('channels', channels)
                    const ch = _.orderBy(results, ['name'],['desc'])
                    setChannels(ch);
                    // store in redux
                    setLoading(false);
                    }, handleError);
        } catch (error) {
            console.log('error fetching admin recs ', error);
        }
    };



    const openBottomSheet = () => {
        bs.current.snapTo(0);
    }

    const renderContent = () => (
        <View style={styles.bottomsheet}>
          <TextInput
            label="Channel Name"
            type="outlined"
            numberOfLines={1}
            onChangeText={(text) => setChanel(text)}
            value={channel}
            style={styles.textinput}
            placeholder="Enter Channel name"
          />
          <View style={{ marginTop: 2}}>
            <Button icon="check-all" mode="contained" style={styles.button} onPress={createChannel}>
              Create Channel
            </Button>
            <Button icon="cancel" mode="outlined" style={[styles.button]} onPress={() =>  bs.current.snapTo(1)}>
              Cancel
            </Button>
          </View>
        </View>
      );
    
    const renderHeader = () => (
        <View style={styles.header}>
            <View style={styles.panelHeader}>
            <View style={styles.panelHandle} />
            </View>
        </View>
    );

    const renderBottomSheet = () => (
        <BottomSheet
        ref={bs}
        snapPoints={[230, 0]}
        renderContent={renderContent}
        renderHeader={renderHeader}
        initialSnap={1}
        enabledGestureInteraction={true}
        />
      )

    const renderEmptyContainer = () => (
        <View/>
    )

    const header = () => (
        <Appbar.Header>
            <Appbar.BackAction onPress={()=> props.navigation.goBack()} />
            <Appbar.Content title="Channels"  />
        </Appbar.Header>
    );

    const Groups = () => (
        <View style={styles.container}>
            
            <FlatList
                data={channels}
                renderItem={({item}) => (
                    <TouchableRipple onPress={() => handlePress}>
                        <List.Item
                            title={item.name}
                            left={props => <List.Icon {...props} icon="account-circle" />}
                            right={props => <List.Icon {...props} icon="chevron-right" />}
                        />
                    </TouchableRipple>
                )}
                keyExtractor={(item) => item.punchinTime}
                ItemSeparatorComponent={Seperator}
            />
            <FAB
                style={styles.fab}
                small
                icon="plus"
                onPress={() => openBottomSheet()}
            />
              {renderBottomSheet()}
        </View>
    );

    return (
        <>
        {header()}
        <Tab.Navigator>
            <Tab.Screen name="Users" component={Groups} />
            <Tab.Screen name="Channel" component={Groups} />
        </Tab.Navigator>
        </>
    );
}

export default Channels;


