import './index.css'

const SimilarProductItem = props => {
  const {productInformation} = props

  const {title, imageUrl, rating, price, brand} = productInformation

  return (
    <li className="product-item">
      <img
        src={imageUrl}
        alt={`similar product ${title}`}
        className="similar-product-image"
      />
      <p className="similar-product-title">{title}</p>
      <p className="similar-product-brand">by {brand}</p>
      <div className="similar-product-price-rating-container">
        <p className="similar-product-price">Rs {price}/-</p>
        <div className="similar-product-rating-container">
          <p className="similar-product-rating">{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="similar-star-image"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
