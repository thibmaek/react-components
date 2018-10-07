import React from 'react';
import { Animated, Easing } from 'react-native';
import Proptypes from 'prop-types';

const BOUNCE_DIRECTIONS = Object.freeze({
  BOTTOM: 'bottom',
  LEFT: 'left',
  RIGHT: 'right',
  TOP: 'top',
});

const TProps = {
  bounceInFrom: Proptypes.oneOf(['bottom', 'left', 'right', 'top']),
  children: Proptypes.node,
  topLevel: Proptypes.bool,
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
        duration: 4000,
        easing: Easing.quad(100),
        toValue: 1,
        useNativeDriver: true,
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
    const positiveRange = [0, this.deviceWidth / 2, this.deviceWidth / 4, 0];
    const negativeRange = [this.deviceHeight, this.deviceHeight / 2, this.deviceHeight / 4, 0];

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
      inputRange: [0, 0.5, 0.75, 1],
      outputRange: this.transformOutputRange,
    });

    return (
      <Animated.View style={[
        this.props.topLevel && { zIndex: 1 },
        { transform: [{
          ...(this.directionIsHorizontal ? { translateX: translationValue } : {}),
          ...(this.directionIsVertical ? { translateY: translationValue } : {}),
        }] }
      ]}>
        {this.props.children}
      </Animated.View>
    );
  }
}

export default Bounce;
