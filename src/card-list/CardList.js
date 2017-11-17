import React, { Component } from 'react'
import { View, FlatList, Dimensions } from 'react-native'

import styles from './CardListStyle'

const { height, width } = Dimensions.get('window')

class CardList extends Component {
  constructor(props) {
    super(props)
    const { spaceBetweenCards, unselectedCardsWidth } = props

    this.state = {
      itemSize: width - (spaceBetweenCards + unselectedCardsWidth * 2),
      currentItem: props.selectedIndex || 0,
      animated: false
    }

    this._getItemOffset = this._getItemOffset.bind(this)
    this._getItemLayout = this._getItemLayout.bind(this)
    this._onMomentumScrollEnd = this._onMomentumScrollEnd.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    const {
      spaceBetweenCards,
      unselectedCardsWidth = 0,
      cards,
      onChangeSelected
    } = this.props

    this.setState({
      itemSize: width - (spaceBetweenCards + unselectedCardsWidth * 2),
      currentItem: nextProps.selectedIndex,
      animated: cards === nextProps.cards
    })
  }

  componentDidUpdate(prevProps) {
    const { onChangeSelected, unselectedCardsWidth, spaceBetweenCards, cards } = this.props
    const { currentItem, animated } = this.state

    if (this.props.selectedIndex === prevProps.selectedIndex) {
      return
    }

    this.list.scrollToOffset({
      offset: this._getItemOffset(currentItem) - spaceBetweenCards - (unselectedCardsWidth / 2),
      animated: animated
    })
  }

  _getItemOffset(index) {
    const offset = index * this.state.itemSize

    return offset
  }

  _getItemLayout(data, index) {
    const { itemSize } = this.state
    const { spaceBetweenCards, unselectedCardsWidth } = this.props

    return {
      length: itemSize,
      offset: itemSize * index,
      index
    }
  }

  _onMomentumScrollEnd({ nativeEvent }) {
    const { unselectedCardsWidth, spaceBetweenCards, cards, onChangeSelected = () => { } } = this.props

    if (!cards) {
      return
    }

    const offset = nativeEvent.contentOffset.x + unselectedCardsWidth + spaceBetweenCards
    const currentItem = Math.round(offset / this.state.itemSize)

    this.setState({ currentItem }, () =>
      onChangeSelected(cards[currentItem])
    )
  }

  render() {
    const { itemSize } = this.state
    const {
      render = () => { },
      style = {},
      selectedIndex,
      spaceBetweenCards,
      unselectedCardsWidth = 0,
      cards,
      options = {}
    } = this.props

    const dimensions = {
      width: width - spaceBetweenCards - (unselectedCardsWidth * 2),
      height
    }

    return (
      <View>
        <FlatList
          {...options}
          ref={ref => { this.list = ref }}
          bounces={false}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          automaticallyAdjustContentInsets={false}
          onContentSizeChange={() => false}
          decelerationRate='fast'
          showHorizontalScrollIndicator={false}
          snapToInterval={itemSize}
          style={[styles.cardList, style]}
          snapToAlignment='center'
          scrollEventThrottle={1}
          removeClippedSubviews={false}
          initialNumToRender={10}
          data={cards}
          keyExtractor={(item, index) => `card-list-${index}-${item.id}`}
          getItemLayout={this._getItemLayout}
          initialScrollIndex={selectedIndex}
          onMomentumScrollEnd={this._onMomentumScrollEnd}
          contentInset={{ left: unselectedCardsWidth, right: unselectedCardsWidth }}
          renderItem={(...args) =>
            render(
              ...args,
              dimensions
            )
          }
        />
      </View>
    )
  }
}

export default CardList
