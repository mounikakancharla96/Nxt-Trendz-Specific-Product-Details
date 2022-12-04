import {Component} from 'react'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productDetails: {},
    similarProducts: [],
    apiStatus: apiStatusConstants.initial,
    count: 1,
  }

  componentDidMount() {
    this.getProductsDetails()
  }

  renderProductsInformation = info => ({
    id: info.id,
    imageUrl: info.image_url,
    title: info.title,
    style: info.style,
    price: info.price,
    description: info.description,
    brand: info.brand,
    totalReviews: info.totalReviews,
    rating: info.rating,
    availability: info.availability,
  })

  getProductsDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    this.setState({apiStatus: apiStatusConstants.inProgress})

    const jwtToken = Cookies.get('jwt_token')

    const url = `https://apis.ccbp.in/products/${id}`

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(url, options)

    if (response.ok === true) {
      const data = await response.json()

      const updatedData = this.renderProductsInformation(data)
      const updatedSimilarData = data.similar_products.map(eachProduct =>
        this.renderProductsInformation(eachProduct),
      )

      this.setState({
        productDetails: updatedData,
        similarProducts: updatedSimilarData,
        apiStatus: apiStatusConstants.success,
      })
    }
    if (response.status === 404) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onClickAddToCartBtn = () => {
    const {history} = this.props

    history.replace('/products')
  }

  onClickMinusBtn = () => {
    const {count} = this.state

    if (count > 1) {
      this.setState(prevState => ({
        count: prevState.count - 1,
      }))
    }
  }

  onClickPlusBtn = () => {
    this.setState(prevState => ({
      count: prevState.count + 1,
    }))
  }

  renderLoaderView = () => (
    <div className="products-details-loader-container" testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="error-msg"
      />
      <h1 className="failure-heading">Product Not Found</h1>
      <Link to="/products">
        <button type="button" className="failure-btn">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  renderProductItemsDetails = () => {
    const {productDetails, count, similarProducts} = this.state

    const {
      imageUrl,
      title,
      price,
      description,
      brand,
      totalReviews,
      rating,
      availability,
    } = productDetails

    return (
      <div className="main-container">
        <div className="product-details-info-container">
          <img src={imageUrl} alt="product" className="product-info-image" />
          <div className="product-info-container">
            <h1 className="title-heading">{title}</h1>
            <p className="price">Rs {price}/-</p>
            <div className="rating-and-reviews-container">
              <div className="ratings-container">
                <p className="rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png "
                  alt="star"
                  className="star"
                />
              </div>
              <p className="total-reviews">{totalReviews} Reviews</p>
            </div>
            <p className="description">{description}</p>
            <p className="in-stock">
              <snap className="availability">Available: </snap>
              {availability}
            </p>
            <p className="in-stock">
              <snap className="availability">Brand: </snap>
              {brand}
            </p>
            <hr className="hr" />
            <div className="no-of-count-container">
              <button
                type="button"
                className="button"
                onClick={this.onClickMinusBtn}
                testid="minus"
              >
                <BsDashSquare className="btn-image" />
              </button>
              <p className="count">{count}</p>
              <button
                type="button"
                className="button"
                onClick={this.onClickPlusBtn}
                testid="plus"
              >
                <BsPlusSquare className="btn-image" />
              </button>
            </div>
            <button
              type="button"
              className="add-to-cart-btn"
              onClick={this.onClickAddToCartBtn}
            >
              ADD TO CART
            </button>
          </div>
        </div>
        <h1 className="similar-products-heading">Similar Products</h1>
        <ul className="similar-products-list">
          {similarProducts.map(eachProduct => (
            <SimilarProductItem
              key={eachProduct.id}
              productInformation={eachProduct}
            />
          ))}
        </ul>
      </div>
    )
  }

  renderAllProductsView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductItemsDetails()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="container">
          <div className="products-items-container">
            {this.renderAllProductsView()}
          </div>
        </div>
      </>
    )
  }
}

export default ProductItemDetails
