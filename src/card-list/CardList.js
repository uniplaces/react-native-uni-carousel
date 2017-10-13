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
      currentItem: props.selectedIndex || 0
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
      cards,
      onChangeSelected
    } = this.props
    const { currentItem } = this.state

    this.setState({
      itemSize: width - (spaceBetweenCards + unselectedCardsWidth * 2),
      currentItem: nextProps.selectedIndex
    })
  }

  componentDidUpdate(prevProps) {
    const { onChangeSelected, unselectedCardsWidth, spaceBetweenCards, cards } = this.props
    const { currentItem } = this.state

    if (this.props.selectedIndex === prevProps.selectedIndex) {
      return 
    }

    onChangeSelected(currentItem, cards[currentItem])
    this.list.scrollToOffset({ 
      offset: this._getItemOffset(currentItem) - spaceBetweenCards - (unselectedCardsWidth / 2),
      animated: prevProps.cards === cards
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
    const { unselectedCardsWidth, spaceBetweenCards, cards, onChangeSelected = () => {} } = this.props

    const offset = nativeEvent.contentOffset.x + unselectedCardsWidth + spaceBetweenCards
    const currentItem = Math.round(offset / this.state.itemSize)

    this.setState({ currentItem }, () =>
      onChangeSelected(currentItem, cards[currentItem])
    )
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
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          automaticallyAdjustContentInsets={false}
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
