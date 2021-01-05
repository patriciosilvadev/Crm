import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  TextInput,
} from 'react-native';

import {useTheme} from 'react-native-paper';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import {useSelector, useDispatch} from 'react-redux';
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
import {Appbar} from 'react-native-paper';
import ImagePicker from 'react-native-image-crop-picker';

import styles from "./styles";

const EditProfileScreen = (props) => {
    const User = useSelector((state) => state.User);
    const {user, punchedIn} = User;
    const dispatch = useDispatch();
    const [image, setImage] = useState('https://api.adorable.io/avatars/80/abott@adorable.png');

    const {colors} = useTheme();

    const takePhotoFromCamera = () => {
        ImagePicker.openCamera({
        compressImageMaxWidth: 300,
        compressImageMaxHeight: 300,
        cropping: true,
        compressImageQuality: 0.7
        }).then(image => {
        console.log(image);
        setImage(image.path);
        bs.current.snapTo(1);
        });
    }

    const choosePhotoFromLibrary = () => {
        ImagePicker.openPicker({
        width: 300,
        height: 300,
        cropping: true,
        compressImageQuality: 0.7
        }).then(image => {
        console.log(image);
        setImage(image.path);
        bs.current.snapTo(1);
        });
    }

    const renderInner = () => (
        <View style={styles.panel}>
        <View style={{alignItems: 'center'}}>
            <Text style={styles.panelTitle}>Upload Photo</Text>
            <Text style={styles.panelSubtitle}>Choose Your Profile Picture</Text>
        </View>
        <TouchableOpacity style={styles.panelButton} onPress={takePhotoFromCamera}>
            <Text style={styles.panelButtonTitle}>Take Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.panelButton} onPress={choosePhotoFromLibrary}>
            <Text style={styles.panelButtonTitle}>Choose From Library</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={styles.panelButton}
            onPress={() => bs.current.snapTo(1)}>
            <Text style={styles.panelButtonTitle}>Cancel</Text>
        </TouchableOpacity>
        </View>
    );

    const renderHeader = () => (
        <View style={styles.header}>
        <View style={styles.panelHeader}>
            <View style={styles.panelHandle} />
        </View>
        </View>
    );

    const Header = () => (
        <Appbar.Header style={{backgroundColor: colors.primaryDark}}>
            <Appbar.BackAction onPress={()=> props.navigation.goBack()} />
          <Appbar.Content title="Edit Profile" />
        </Appbar.Header>
    );

    const bs = React.createRef();
    const fall = new Animated.Value(1);

    return (
        <View style={styles.container}>
            {Header()}
        <BottomSheet
            ref={bs}
            snapPoints={[330, 0]}
            renderContent={renderInner}
            renderHeader={renderHeader}
            initialSnap={1}
            callbackNode={fall}
            enabledGestureInteraction={true}
        />
        <Animated.View style={{margin: 20,
            opacity: Animated.add(0.1, Animated.multiply(fall, 1.0)),
        }}>
            <View style={{alignItems: 'center'}}>
            <TouchableOpacity onPress={() => bs.current.snapTo(0)}>
                <View
                style={{
                    height: 100,
                    width: 100,
                    borderRadius: 15,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <ImageBackground
                    source={{
                    uri: user.image === undefined ? image : user.image,
                    }}
                    style={{height: 100, width: 100}}
                    imageStyle={{borderRadius: 15}}>
                    <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <Icon
                        name="camera"
                        size={35}
                        color="#fff"
                        style={{
                        opacity: 0.7,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 1,
                        borderColor: '#fff',
                        borderRadius: 10,
                        }}
                    />
                    </View>
                </ImageBackground>
                </View>
            </TouchableOpacity>
            <Text style={{marginTop: 10, fontSize: 18, fontWeight: 'bold'}}>
                {user.name}
            </Text>
            </View>

            <View style={styles.action}>
            <FontAwesome name="user-o" color={colors.text} size={20} />
            <TextInput
                placeholder="First Name"
                placeholderTextColor="#666666"
                autoCorrect={false}
                style={[
                styles.textInput,
                {
                    color: colors.text,
                },
                ]}
            />
            </View>
            <View style={styles.action}>
            <FontAwesome name="user-o" color={colors.text} size={20} />
            <TextInput
                placeholder="Last Name"
                placeholderTextColor="#666666"
                autoCorrect={false}
                style={[
                styles.textInput,
                {
                    color: colors.text,
                },
                ]}
            />
            </View>
            <View style={styles.action}>
            <Feather name="phone" color={colors.text} size={20} />
            <TextInput
                placeholder="Phone"
                placeholderTextColor="#666666"
                keyboardType="number-pad"
                autoCorrect={false}
                style={[
                styles.textInput,
                {
                    color: colors.text,
                },
                ]}
            />
            </View>
            <View style={styles.action}>
            <FontAwesome name="envelope-o" color={colors.text} size={20} />
            <TextInput
                placeholder="Email"
                placeholderTextColor="#666666"
                keyboardType="email-address"
                autoCorrect={false}
                style={[
                styles.textInput,
                {
                    color: colors.text,
                },
                ]}
            />
            </View>
            <View style={styles.action}>
            <FontAwesome name="globe" color={colors.text} size={20} />
            <TextInput
                placeholder="Country"
                placeholderTextColor="#666666"
                autoCorrect={false}
                style={[
                styles.textInput,
                {
                    color: colors.text,
                },
                ]}
            />
            </View>
            <View style={styles.action}>
            <Icon name="map-marker-outline" color={colors.text} size={20} />
            <TextInput
                placeholder="City"
                placeholderTextColor="#666666"
                autoCorrect={false}
                style={[
                styles.textInput,
                {
                    color: colors.text,
                },
                ]}
            />
            </View>
            <TouchableOpacity style={styles.commandButton} onPress={() => {}}>
            <Text style={styles.panelButtonTitle}>Submit</Text>
            </TouchableOpacity>
        </Animated.View>
        </View>
    );
};

export default EditProfileScreen;

