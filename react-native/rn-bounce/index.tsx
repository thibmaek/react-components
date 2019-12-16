import React, { ReactNode } from 'react';
import { Animated, Easing, Dimensions, StyleProp, ViewStyle } from 'react-native';

const BOUNCE_DIRECTIONS = Object.freeze({
  BOTTOM: 'bottom',
  LEFT: 'left',
  RIGHT: 'right',
  TOP: 'top',
});

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
  onWillAppear?: () => void;
  /**
   * Handler called immediatly after the animation has finished.
   * Will be called as the callback passed to Animated.start(result.finished)
   */
  onDidAppear?: () => void;
}

class Bounce extends React.Component<Props> {

  static defaultProps = {
    bounceInFrom: BOUNCE_DIRECTIONS.LEFT,
    topLevel: true,
    onWillAppear: () => {},
    onDidAppear: () => {},
  };

  animatedValue = new Animated.Value(0);
  deviceHeight = Dimensions.get("screen").height;
  deviceWidth = Dimensions.get("screen").width;

  componentDidMount() {
    this.animatedValue.setValue(0);

    Animated.spring(
      this.animatedValue,
      {
        toValue: 1,
        useNativeDriver: true,
        friction: 8,
      }
    ).start((result) => {
      if (!result.finished) {
        this.props.onWillAppear();
      } else {
        this.props.onDidAppear();
      }
    });
  }

  get directionIsHorizontal() {
    return this.props.bounceInFrom === BOUNCE_DIRECTIONS.LEFT || this.props.bounceInFrom === BOUNCE_DIRECTIONS.RIGHT;
  }

  get directionIsVertical() {
    return this.props.bounceInFrom === BOUNCE_DIRECTIONS.TOP || this.props.bounceInFrom === BOUNCE_DIRECTIONS.BOTTOM;
  }

  get transformOutputRange() {
    const positiveRange = [-800, 0];
    const negativeRange = [800, 0];

    switch (this.props.bounceInFrom) {
      case BOUNCE_DIRECTIONS.TOP:
       return positiveRange;
      case BOUNCE_DIRECTIONS.BOTTOM:
        return negativeRange;
      case BOUNCE_DIRECTIONS.LEFT:
        return positiveRange;
      case BOUNCE_DIRECTIONS.RIGHT:
        return negativeRange;
      default:
        return positiveRange;
    }
  }

  render() {
    const translationValue = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: this.transformOutputRange,
    });

    const { topLevel, children, style } = this.props;

    return (
      <Animated.View style={[
        topLevel && { zIndex: 1 },
        {
          transform: [{
          ...(this.directionIsHorizontal ? { translateX: translationValue } : {}),
          ...(this.directionIsVertical ? { translateY: translationValue } : {}),
          }]
        },
        style,
      ]}>
        {children}
      </Animated.View>
    );
  }
}

export default Bounce;
