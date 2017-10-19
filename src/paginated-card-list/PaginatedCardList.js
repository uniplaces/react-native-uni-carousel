import React, { Component } from 'react'

import CardList from '../../src'

const isFirstItem = (itemNumber) => {
  return itemNumber === 0
}

const isLastItem = (itemNumber, cards) => {
  return itemNumber === cards.length - 1
}

// SHOULD BE POSSIBLE TO DECIDE LOADING CARD FROM OUTSIDE
const loadingItem = { loading: true }

const getPagesWithLoadingCards = (pages, hasMorePages = false) => {
  return Object.keys(pages)
    .reduce((acc, pageKey, index) => {
      if (index === 0) {
        acc[pageKey] = pages[pageKey].concat({ ending: true, ...loadingItem })

        return acc
      } 

      acc[pageKey] = [{ starting: true, ...loadingItem }]
        .concat(pages[pageKey]
        .concat({ ending: true, ...loadingItem }))

      return acc
    }, {})
}

class PaginatedCardList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedPage: 0,
      selectedItem: 0,
      pages: getPagesWithLoadingCards(props.pages, props.hasMorePages),
    }

    this._onNextPage = this._onNextPage.bind(this)
    this._onPreviousPage = this._onPreviousPage.bind(this)
    this._getSelectedItem = this._getSelectedItem.bind(this)
  }

  componentWillReceiveProps({ currentPage, pages, hasMorePages }) {
    const { selectedItem, selectedPage } = this.state
    
    const newPages = getPagesWithLoadingCards(pages, hasMorePages)
    const hasPageChanged = currentPage !== selectedPage
    const nextPageIndex = () => currentPage > selectedPage ? 1 : newPages[currentPage].length - 2

    this.setState({
      selectedPage: currentPage,
      pages: newPages,
      selectedItem: hasPageChanged 
        ? nextPageIndex()
        : this._getSelectedItem(newPages, selectedPage)
    })
  }

  _getSelectedItem(pages, selectedPage) {
    const { getSelectedIndex = () => {} } = this.props

    if (!pages[selectedPage]) {
      return
    }

    return pages[selectedPage].findIndex(getSelectedIndex)
  }

  _onNextPage() {
    const { onChangePage = () => {} } = this.props

    const nextPageIndex = this.state.selectedPage + 1 

    onChangePage(nextPageIndex)
  }

  _onPreviousPage() {
    const { onChangePage = () => {} } = this.props

    const prevPageIndex = this.state.selectedPage - 1

    onChangePage(prevPageIndex)
  }

  render() {
    const { onChangeSelected = () => {}, onChangePage = () => {} } = this.props
    const { pages, selectedPage, selectedItem } = this.state
    
    return (
      <CardList
        {...this.props}
        onChangeSelected={(item) => {
          const selectedItem = item ? pages[selectedPage].findIndex(({ id, loading }) => loading || id === item.id) : null

          if (selectedItem === null) {
            return
          }

          if (item.ending) {
            this._onNextPage()

            return
          }

          if (item.starting) {
            this._onPreviousPage()

            return
          }

          onChangeSelected(item)
        }}
        cards={pages[selectedPage.toString()]}
        selectedIndex={selectedItem}
      />
    )
  }
}

export default PaginatedCardList
