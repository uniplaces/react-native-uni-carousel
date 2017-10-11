import React from 'react';
import { Text, View } from 'react-native';

import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { withKnobs, number } from '@storybook/addon-knobs';

import CardList, { PaginatedCardList } from '../../src';

const cards = [
  { name: 'Uniplaces' },
  { name: 'Book it' },
  { name: 'Book it' },
  { name: 'Book it' },
  { name: 'Book it' },
  { name: 'Live it' }
]

const cenas = {
  1: [{ name: 'blablabla' }, { name: 'blebleble' }]
}

const DefaultCardList = (props) => {
  return (
    <CardList
      // Same as item width
      spaceBetweenCards={marginBetweenCards * 2}
      // Same as item margin
      unselectedCardsWidth={otherCardsWidth}
      render={({ item, index }, { width }) => (
        <View style={{
          backgroundColor: 'red', 
          width: width - (marginBetweenCards * 2), 
          margin: marginBetweenCards,
          height: 100
        }} 
        key={item.name}>
          <Text >{index}</Text>
        </View>
      )}
      cards={cards} 
      {...props}
    />
  )
}

const marginBetweenCards = 5
const otherCardsWidth = 10

const stories = storiesOf('CardList', module)
stories.addDecorator(withKnobs)
  .add('to Storybook', () =>
    <CardList />
  )
  .add('with cards', () => 
    <DefaultCardList />
  )
  .add('with predefined selected index', () => {
    const selected = number('Selected', 3)

    return (
      <DefaultCardList selectedIndex={selected} />
    )
  })
  .add('with on selected item change', () => 
    <DefaultCardList onChangeSelected={action('changed')} />
  )

storiesOf('PaginatedCardList', module)
  .add('basic', () =>
    <PaginatedCardList
      // Same as item width
      spaceBetweenCards={marginBetweenCards * 2}
      // Same as item margin
      unselectedCardsWidth={otherCardsWidth}
      render={({ item, index }, { width }) => (
        <View style={{
          backgroundColor: 'red', 
          width: width - (marginBetweenCards * 2), 
          margin: marginBetweenCards,
          height: 100
        }} 
        key={item.name}>
          <Text >{item.name}</Text>
        </View>
      )}
      pages={{
        0: [{ name: 'page 0 item 0' }, { name: 'page 0 item 1' }],
        1: [{ name: 'page 1 item 0' }, { name: 'page 1 item 1' }],
        2: [{ name: 'page 2 item 0' }, { name: 'page 2 item 1' }]
      }}
    />
  )
