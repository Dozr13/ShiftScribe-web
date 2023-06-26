import { Alert } from 'react-native';

export const yesNo = (title: string, body: string) => {
  return new Promise((res) => {
    Alert.alert(title, body, [
      {
        text: 'No',
      },
      {
        text: 'Yes',
        onPress: res,
      },
    ]);
  });
};
