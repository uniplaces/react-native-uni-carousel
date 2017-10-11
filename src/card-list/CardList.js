import React, { Component } from 'react'
import { StyleSheet, View, FlatList, Dimensions } from 'react-native'

import style from './CardListStyle'

const { height, width } = Dimensions.get('window')

class CardList extends Component {
  constructor(props) {
    super(props)
    const { spaceBetweenCards, unselectedCardsWidth } = props

    this.state = {
      itemSize: width - (spaceBetweenCards + unselectedCardsWidth * 2),
      currentItem: 0
    }

    this._getItemOffset = this._getItemOffset.bind(this)
    this._getItemLayout = this._getItemLayout.bind(this)
    this._onMomentumScrollEnd = this._onMomentumScrollEnd.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    const { 
      selectedIndex,
      spaceBetweenCards, 
      unselectedCardsWidth = 0,
      cards
    } = this.props

    this.setState({
      itemSize: width - (spaceBetweenCards + unselectedCardsWidth * 2)
    })

    this.list.scrollToOffset({ 
      offset: this._getItemOffset(nextProps.selectedIndex),
      animated: cards === nextProps.cards
    })
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
    const { unselectedCardsWidth, spaceBetweenCards, onChangeSelected = () => {} } = this.props

    const offset = nativeEvent.contentOffset.x + unselectedCardsWidth + spaceBetweenCards
    const currentItem = Math.round(offset / this.state.itemSize)

    if (currentItem === this.state.currentItem) {
      return 
    }

    this.setState({ currentItem }, () => onChangeSelected(currentItem))
  }

  render() {
    const { itemSize } = this.state
    const { 
      render = () => {},
      style = {},
      selectedIndex,
      spaceBetweenCards,
      unselectedCardsWidth = 0,
      cards,
      options = {}
    } = this.props

    return (
      <View>
        <FlatList 
          ref={(list) => this.list = list}
          bounces={true}
          centerContent={true}
          horizontal={true}
          automaticallyAdjustContentInsets={false}
          numColumns={1}
          onContentSizeChange={() => false}
          decelerationRate='fast'
          showHorizontalScrollIndicator={false}
          snapToInterval={itemSize}
          style={[style.cardList, style]}
          contentContainerStyle={style.container}
          snapToAlignment='center'
          scrollEventThrottle={1}
          initialNumToRender={10}
          data={cards}
          keyExtractor={(item, index) => `card-list-${index}`}
          getItemLayout={this._getItemLayout}
          extraData={selectedIndex}
          initialScrollIndex={selectedIndex}
          onMomentumScrollEnd={this._onMomentumScrollEnd}
          contentInset={{ left: unselectedCardsWidth, right: unselectedCardsWidth }}
          renderItem={(...args) => 
            render(
              ...args, 
              { width: width - spaceBetweenCards - (unselectedCardsWidth * 2), height }
            )
          }
          {...options}
        />
      </View>
    )
  }
}

export default CardList
