import React, { Component } from 'react'

import CardList from '../../src'

// SHOULD BE POSSIBLE TO DECIDE LOADING CARD FROM OUTSIDE
const loadingItem = { loading: true }

const getPagesWithLoadingCards = (pages, hasMorePages = false) => {
  return Object.keys(pages)
    .reduce((acc, pageKey, index) => {
      if (index === 0) {
        acc[pageKey] = pages[pageKey].concat(hasMorePages ? [{ ending: true, ...loadingItem }] : [])

        return acc
      }

      acc[pageKey] = [{ starting: true, ...loadingItem }]
        .concat(pages[pageKey]
          .concat(hasMorePages ? { ending: true, ...loadingItem } : []))

      return acc
    }, {})
}

class PaginatedCardList extends Component {
  constructor(props) {
    super(props)

    const selectedPage = props.currentPage || 0
    const pages = getPagesWithLoadingCards(props.pages, props.hasMorePages)
    const selectedItem = this._getSelectedItem(pages, selectedPage, this.props.getSelectedIndex)

    this.state = {
      selectedItem: selectedItem !== -1 ? selectedItem : 1,
      selectedPage,
      pages
    }

    this._onNextPage = this._onNextPage.bind(this)
    this._onPreviousPage = this._onPreviousPage.bind(this)
    this._getSelectedItem = this._getSelectedItem.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    const { currentPage, hasMorePages, getSelectedIndex, onChangeSelected } = nextProps
    const { selectedPage } = this.state

    const pages = this.props.pages === nextProps.pages ? this.state.pages : getPagesWithLoadingCards(nextProps.pages, hasMorePages)
    const hasPageChanged = currentPage !== selectedPage
    const nextPageIndex = () => {
      const itemIndex = currentPage > selectedPage ? 1 : pages[currentPage].length - 2
      onChangeSelected && onChangeSelected(pages[currentPage][itemIndex], itemIndex)

      return itemIndex
    }

    this.setState({
      selectedPage: currentPage,
      pages: pages,
      selectedItem: hasPageChanged
        ? nextPageIndex()
        : this._getSelectedItem(pages, selectedPage, getSelectedIndex)
    })
  }

  _getSelectedItem(pages, selectedPage, getSelectedIndex = () => { }) {
    if (!pages[selectedPage]) {
      return
    }

    const a = pages[selectedPage].findIndex(getSelectedIndex)
    console.log(a)

    return a !== -1 || selectedPage > 1 ? 1 : 0
  }

  _onNextPage() {
    const { onChangePage = () => { } } = this.props

    const nextPageIndex = this.state.selectedPage + 1

    onChangePage(nextPageIndex)
  }

  _onPreviousPage() {
    const { onChangePage = () => { } } = this.props

    const prevPageIndex = this.state.selectedPage - 1

    onChangePage(prevPageIndex)
  }

  render() {
    const { onChangeSelected = () => { } } = this.props
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
