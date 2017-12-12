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
      cards
    } = this.props

    this.setState({
      itemSize: width - (spaceBetweenCards + unselectedCardsWidth * 2),
      animated: cards === nextProps.cards
    })
  }

  componentDidUpdate(prevProps) {
    const { currentItem, animated } = this.state

    if (this.props.selectedIndex === prevProps.selectedIndex || this.props.selectedIndex === currentItem) {
      return
    }

    this._scrollToIndex({ index: this.props.selectedIndex, animated: animated })
  }

  _scrollToIndex({ index, animated }) {
    const { unselectedCardsWidth, spaceBetweenCards } = this.props

    this.list.scrollToOffset({
      offset: this._getItemOffset(index) - spaceBetweenCards - (unselectedCardsWidth / 2),
      animated: animated
    })

    this.setState({ currentItem: index })
  }

  _getItemOffset(index) {
    const offset = index * this.state.itemSize

    return offset
  }

  _getItemLayout(data, index) {
    const { itemSize } = this.state

    return {
      length: itemSize,
      offset: itemSize * index,
      index
    }
  }

  _onMomentumScrollEnd({ nativeEvent }) {
    const { unselectedCardsWidth, spaceBetweenCards, cards, onChangeSelected = () => {} } = this.props

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
          extraData={this.state}
          bounces={true}
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
