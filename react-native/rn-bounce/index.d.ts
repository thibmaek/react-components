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

    /* Style applied to the outer Animated.View component */
    style?: StyleProp<ViewStyle> | StyleProp<ViewStyle>[];

    /**
     * Handler called immediatly after triggering the animation.
     * Will be called as the callback passed to Animated.start()
     */
    onWillAppear: () => void;

    /**
     * Handler called immediatly after the animation has finished.
     * Will be called as the callback passed to Animated.start(result.finished)
     */
    onDidAppear: () => void;
  }

  const Bounce: ComponentClass<Props>
  export default Bounce;

}
