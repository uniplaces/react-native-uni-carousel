# React Native Uni Carousel

This small package is based on FlatList. It provides components to help create both a horizontal list of items and a paginated horizontal list of items.

## Usage

### CardList 

Simple FlatList card with some helper methods

```
  <CardList
    // Same as item width
    spaceBetweenCards={marginBetweenCards * 2}
    // Same as item margin
    unselectedCardsWidth={otherCardsWidth}
    render={({ item, index }, { width }) => (
      // render of each item
    )}
    cards={[{ name: 'item1' }, { name: 'item2' }]} 
    options={options}
  />
```

#### Props

**spaceBetweenCards** - Margin between cards
**selectedIndex** - Item that is selected on the list
**onChangeSelected** - Callback called when the selectedItem changes
**unselectedCardsWidth** - Space from the next and previous card that is shown
**render(itemToRender, CardListContainerProps)** - Render callback of every single item
**cards** - The array of items to render
**options** - Object of props that get directly passed to `FlatList`

### PaginatedCardList

Just a wrapper around `CardList` that handles the pagination and provides some callbacks to track page changes

```
  <PaginatedCardList
    // Same props as CardList (they get passed down to CardList, except cards)
    pages={pages}
    onChangePage={onChangePage}
  />
```

#### Props

**pages** - Object with keys as numbers (`{1: [page 1 array of items], 2: [page 2 array of items]}`
**onChangePage** - Callback that gets called on page change



