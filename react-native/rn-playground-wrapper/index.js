import React from 'react';
import { SafeAreaView, ScrollView, View, Picker, Text, ViewPropTypes } from 'react-native';
import Proptypes from 'prop-types';

import { diff } from './utils';
import styles from "./StyleSheet";

const TProps = {
  componentContainerStyle: ViewPropTypes.style,
  components: Proptypes.objectOf(Proptypes.node).isRequired,
  componentState: Proptypes.object,
  contentContainerStyle: ViewPropTypes.style,
  exclude: Proptypes.arrayOf(Proptypes.string),
  infoTop: Proptypes.string,
  pickerStyle: ViewPropTypes.style,
  title: Proptypes.string,
  titleStyle: ViewPropTypes.style,
  sortComponentKeys: Proptypes.bool,
  firstComponent: Proptypes.string,
}

export default class PlaygroundWrapper extends React.Component {
  static propTypes = TProps;

  static defaultProps = {
    componentContainerStyle: {},
    componentState: {},
    contentContainerStyle: {},
    exclude: [],
    infoTop: null,
    title: null,
    sortComponentKeys: false,
    firstComponent: undefined,
  };

  constructor(props) {
    super(props);

    const PascalCaseOnly = Object.keys(props.components)
      .filter(component => component.charAt(0).match(/[A-Z]/));

    let comps = diff(PascalCaseOnly, this.props.exclude)

    if (props.sortComponentKeys) {
      comps.sort();
    }

    if (props.firstComponent && comps.includes(props.firstComponent)) {
      const insertedComp = comps.find(i => i === props.firstComponent);
      comps = comps.filter(comp => comp !== props.firstComponent);
      comps = [insertedComp, ...comps];
    }

    this.availableComponents = comps.map(item => ({ value: item, label: `${item}` }))

    this.state = {
      component: this.availableComponents[0].label,
      pickerVisible: false
    };
  }

  get CurrentComponent() {
    return this.props.components[this.state.component];
  }

  get hasValidChildren() {
    return this.props.children && this.props.children instanceof Function;
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
          {this.hasValidChildren && this.props.children({ activeComponent: this.state.component })}
        </ScrollView>
      </SafeAreaView>
    );
  }
}
