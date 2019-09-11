declare module '@thibmaek/rn-bounce' {

  import { ComponentClass, ReactNode } from 'react';
  import { StyleProp, ViewStyle } from 'react-native';

  interface Props {
    /* Component tree which gets animated with the Bounce component */
    children?: ReactNode;

    /* Direction to bounce in from, default left */
    bounceInFrom?: 'bottom' | 'left' | 'right' | 'top';

    /* Should the rendered view appear at top z level */
    topLevel?: boolean;

    style?: StyleProp<ViewStyle> | StyleProp<ViewStyle>[];
  }

  const Bounce: ComponentClass<Props>
  export default Bounce;

}
