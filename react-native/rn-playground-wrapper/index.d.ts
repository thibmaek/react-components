declare module '@thibmaek/rn-playground-wrapper' {

  import { ComponentClass, ReactNode } from 'react';

  import { StyleProp, ViewStyle } from 'react-native';

  interface Props {
    /* Components to show under the component view */
    children?: ReactNode,

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
    titleStyle?: StyleProp<ViewStyle>,
  }

  const PlaygroundWrapper: ComponentClass<Props>
  export default PlaygroundWrapper;

}
