import React from 'react';
import { SafeAreaView, ScrollView, View, Picker, Text, StyleProp, ViewStyle, TextStyle } from 'react-native';

import { diff } from './utils';
import styles from "./styles";

interface Props {
  componentContainerStyle?: StyleProp<ViewStyle>,
  components: string[],
  componentState?: Object,
  contentContainerStyle?: StyleProp<ViewStyle>,
  exclude?: string[],
  infoTop?: string,
  pickerStyle?: StyleProp<ViewStyle>,
  title?: string,
  titleStyle: StyleProp<TextStyle>
};

interface State {
  component: string,
  pickerVisible: boolean,
}

export default class PlaygroundWrapper extends React.Component<Props, State> {
  static defaultProps = {
    componentContainerStyle: {},
    componentState: {},
    contentContainerStyle: {},
    exclude: [],
    infoTop: null,
    title: null,
  };

  availableComponents: Array<{ value: string, label: string }>

  constructor(props) {
    super(props);

    const PascalCaseOnly = Object.keys(props.components)
      .filter(component => component.charAt(0).match(/[A-Z]/));

    this.availableComponents = diff(PascalCaseOnly, this.props.exclude)
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
      infoTop,
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
            {infoTop && (
              <Text style={styles.infoTop}>{infoTop}</Text>
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
          {this.props.children}
        </ScrollView>
      </SafeAreaView>
    );
  }
}
