import React from 'react';
import { Animated, Easing, Dimensions } from 'react-native';
import Proptypes from 'prop-types';

const BOUNCE_DIRECTIONS = Object.freeze({
  BOTTOM: 'bottom',
  LEFT: 'left',
  RIGHT: 'right',
  TOP: 'top',
});

const TProps = {
  bounceInFrom: Proptypes.oneOf(['bottom', 'left', 'right', 'top']),
  children: Proptypes.node.isRequired,
  topLevel: Proptypes.bool,
  style: Proptypes.object,
};

class Bounce extends React.Component {

  static defaultProps = {
    bounceInFrom: BOUNCE_DIRECTIONS.LEFT,
    topLevel: true,
  };

  static propTypes = TProps;

  animatedValue = new Animated.Value(0);
  deviceHeight = Dimensions.get("screen").height;
  deviceWidth = Dimensions.get("screen").width;

  componentDidMount() {
    this.animatedValue.setValue(0);

    Animated.spring(
      this.animatedValue,
      {
        easing: Easing.quad(100),
        toValue: 1,
        useNativeDriver: true,
        friction: 8,
      }
    ).start();
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
