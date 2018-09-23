import React from 'react';
import { SafeAreaView, ScrollView, View, Picker, Text } from 'react-native';

import styles from './StyleSheet';

export default class PlaygroundWrapper extends React.Component {
  static defaultProps = {
    componentContainerStyle: {},
    componentState: {},
    contentContainerStyle: {},
    exclude: '',
    pickerStyle: {},
    title: null,
  };

  constructor(props) {
    super(props);

    this.availableComponents = Object.keys(props.components)
      .filter(component => component.charAt(0).match(/[A-Z]/))
      .filter(component => props.exclude ? component.indexOf(props.exclude) === -1 : true)
      .map(item => ({ value: item, label: `${item}` }));

    this.state = {
      component: this.availableComponents[0].label,
      pickerVisible: false
    };
  }

  get CurrentComponent() {
    return this.props.components[this.state.component];
  }

  render() {
    const {
      componentContainerStyle,
      componentState,
      contentContainerStyle,
      pickerStyle,
      title,
      titleStyle,
    } = this.props;

    const currentComponentState = componentState[this.state.component];

    return (
      <SafeAreaView style={styles.safeAreaViewContainer}>
        <ScrollView contentContainerStyle={[styles.scrollViewContainer, contentContainerStyle]}>
          <View>
            {title && (
              <Text style={[styles.title, titleStyle]}>
                {title.toUpperCase()}
              </Text>
            )}
            <Picker
              style={pickerStyle}
              selectedValue={this.state.component}
              onValueChange={value => this.setState({ component: value })}
            >
              {this.availableComponents.map(component => (
                <Picker.Item
                  key={component.value}
                  label={component.label}
                  value={component.value}
                />
              ))}
            </Picker>
          </View>
          <View style={[styles.componentContainer, componentContainerStyle]}>
            {currentComponentState ? (
              <this.CurrentComponent {...currentComponentState} />
            ) : (
              <this.CurrentComponent />
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
