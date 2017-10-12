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

const getPagesWithLoadingCards = (pages) => {
  return Object.keys(pages)
    .reduce((acc, pageKey) => {
      if (parseInt(pageKey) === 0) {
        acc[pageKey] = pages[pageKey].concat(loadingItem)

        return acc
      } 

      acc[pageKey] = [loadingItem].concat(pages[pageKey].concat(loadingItem))

      return acc
    }, {})
}

class PaginatedCardList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedPage: 0,
      pages: getPagesWithLoadingCards(props.pages)
    }

    this._onNextPage = this._onNextPage.bind(this)
    this._onPreviousPage = this._onPreviousPage.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    const hasNewPage = nextProps.pages && Object.keys(nextProps.pages).length > Object.keys(this.props.pages.length)
    this.setState({
      pages: getPagesWithLoadingCards(nextProps.pages),
    }, () => {
      if (hasNewPage) {
        this._onNextPage()
      }
    })
  }

  _onNextPage() {
    const { onChangePage = () => {} } = this.props

    const nextPageIndex = this.state.selectedPage + 1 
    const nextPage = this.state.pages[nextPageIndex]
    this.setState({
      selectedPage: nextPage ? nextPageIndex : this.state.selectedPage,
      selectedItem: nextPage ? 1 : (this.state.selectedItem + 1)
    })

    onChangePage(nextPageIndex)
  }

  _onPreviousPage() {
    const { onChangePage = () => {} } = this.props

    const prevPageIndex = this.state.selectedPage - 1
    const prevPage = this.state.pages[prevPageIndex]

    this.setState({
      selectedPage: prevPage ? prevPageIndex : this.state.selectedPage,
      selectedItem: prevPage ? prevPage.length - 2 : this.state.selectedItem
    })

    onChangePage(prevPageIndex)
  }

  render() {
    const { onChangeSelected = () => {}, onChangePage = () => {} } = this.props
    const { pages, selectedPage, selectedItem } = this.state

    return (
      <CardList
        {...this.props}
        onChangeSelected={(...args) => {
          const selectedItem = parseInt(args[0])

          console.log(selectedItem)

          if (isLastItem(selectedItem, pages[selectedPage])) {
            this._onNextPage()

            return
          }

          if (isFirstItem(selectedItem)) {
            this._onPreviousPage()

            return
          }

          this.setState({ selectedItem })

          onChangeSelected(...args)
        }}
        cards={pages[selectedPage.toString()]}
        selectedIndex={selectedItem}
        onChangePage={onChangePage}
      />
    )
  }
}

export default PaginatedCardList
