import React from 'react';
import { Animated, Easing, Dimensions, AccessibilityInfo } from 'react-native';

const BOUNCE_DIRECTIONS = Object.freeze({
  BOTTOM: 'bottom',
  LEFT: 'left',
  RIGHT: 'right',
  TOP: 'top',
});

class Bounce extends React.Component {

  static defaultProps = {
    bounceInFrom: BOUNCE_DIRECTIONS.LEFT,
    topLevel: true,
    onWillAppear: () => {},
    onDidAppear: () => {},
    prefersReducedMotion: false,
    animationConfig: {
      friction: 8,
      easing: Easing.quad(100),
    },
  };

  constructor(props) {
    super(props);
    this.state = { prefersReducedMotion: props.prefersReducedMotion };
  }

  animatedValue = new Animated.Value(0);
  deviceHeight = Dimensions.get("screen").height;
  deviceWidth = Dimensions.get("screen").width;
  a11ySub = null;

  componentDidMount() {
    const a11ySub = AccessibilityInfo.addEventListener('reduceMotionChanged', this.handleAccessibilityOptions);
    AccessibilityInfo.isReduceMotionEnabled().then(this.handleAccessibilityOptions);
    this.a11ySub = a11ySub;
    
    this.animatedValue.setValue(0);

    Animated.spring(
      this.animatedValue,
      {
        ...this.props.animationConfig,
        toValue: 1,
        useNativeDriver: true,
      }
    ).start((result) => {
      if (!result.finished) {
        this.props.onWillAppear();
      } else {
        this.props.onDidAppear();
      }
    });
  }

  componentWillUnmount() {
    if (this.a11ySub) {
      this.a11ySub.remove();
    }
  }

  handleAccessibilityOptions = (prefersReducedMotion) => this.setState(ps => ({ ...ps, prefersReducedMotion }));

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
          transform: !this.state.prefersReducedMotion ? [{
          ...(this.directionIsHorizontal ? { translateX: translationValue } : {}),
          ...(this.directionIsVertical ? { translateY: translationValue } : {}),
          }]: []
        },
        style,
      ]}>
        {children}
      </Animated.View>
    );
  }
}

export default Bounce;
