import React, { ReactNode } from 'react';
import { SafeAreaView, ScrollView, View, Picker, Text, ViewPropTypes, StyleProp, ViewStyle, TextStyle } from 'react-native';

import { diff } from './utils';
import styles from "./StyleSheet";

interface Props {
  /* Components to show under the component view */
  children?: ({
    activeComponent: string
  }) => ReactNode,
  /* Style to pass to the underlying View that wraps your current component */
  componentContainerStyle?: Object,
  /* A collection of components to pass from an import all */
  components: any,
  /*
    Component state to pass down via props
    The key must have the same value as your component name.
    So with a component ListItem passed:
  */
  componentState?: Object,
  /* Style to pass to the underlying ScrollView */
  contentContainerStyle?: StyleProp<ViewStyle>,
  /* If provided, the keys in the picker will be sorted alphabetically */
  sortComponentKeys?: boolean,
  /* Temporarily put a specific component at the top of the picker */
  firstComponent?: string,
  /* Specific component to exclude from the passed components */
  exclude?: string[],
  /* Text to show beneath the picker */
  infoTop?: string,
  /* Custom style to be applied to picker */
  pickerStyle?: StyleProp<ViewStyle>,
  /* Title which appears above the Picker component */
  title?: string,
  /* Style to pass to the title Text view */
  titleStyle?: StyleProp<TextStyle>,
}

interface State {
  component: string;
  pickerVisible: boolean;
}

export default class PlaygroundWrapper extends React.Component<Props, State> {
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

  constructor(props: Props) {
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

  availableComponents: Array<{ value: any, label: string }>;

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
