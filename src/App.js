import React, { useState, useEffect } from "react";
import Web3 from "web3"
import ignitusNetworksNFTmarketplace from ".\nftmarketplace\build\contracts\ignitusNetworksNFTmarketplace.json"
import "./App.css";

function App() {

  const [state, setState] = useState({
    web3 : null,
    contract : null,
  })

  useEffect( () => {
    async function init() {
    const provider = new Web3.providers.HttpProvider("https://eth-goerli.g.alchemy.com/v2/")
    const web3 = new Web3(provider)
    const networkId = await web3.eth.net.getId()
    const deployedNetwork = ignitusNetworksNFTmarketplace.networks[networkId]
    const contract = new web3.eth.Contract (
      ignitusNetworksNFTmarketplace.abi,
      deployedNetwork.address
    )
    setState({ web3: web3, contract: contract})
    }
    init()
  }, [])
  
  const [pictures, setPictures] = useState([
    { id: 1, src: "image1.jpg", price: 10 },
    { id: 2, src: "image2.jpg", price: 15 },
    { id: 3, src: "image3.jpg", price: 20 },
    { id: 4, src: "image4.jpg", price: 25 },
  ]);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const handleBuyClick = (pictureId) => {
    const selectedPicture = pictures.find(
      (picture) => picture.id === pictureId
    );
    if (selectedPicture) {
      const newCartItems = cartItems.concat(selectedPicture);
      const remainingPictures = pictures.filter(
        (picture) => picture.id !== pictureId
      ); // Filter out purchased picture
      setCartItems(newCartItems);
      setPictures(remainingPictures);
      setTotalPrice((prevTotalPrice) => prevTotalPrice + selectedPicture.price);
    } else {
      console.error("Picture not found:", pictureId);
    }
  };
  const handleRemoveFromCart = (pictureId) => {
    const pictureToRemove = cartItems.find((item) => item.id === pictureId);

    if (pictureToRemove) {
      setCartItems(cartItems.filter((item) => item.id !== pictureId));
      setTotalPrice((prevTotalPrice) => prevTotalPrice - pictureToRemove.price);

      // Add removed picture to pictures state
      setPictures((pictures) => pictures.concat(pictureToRemove));
    } else {
      console.warn("Picture not found in cart:", pictureId);
    }
  };

  const handlePayClick = () => {
    console.log("Payment successful!");
    setPictures(
      pictures.filter(
        (picture) => !cartItems.find((item) => item.id === picture.id)
      )
    );
    setCartItems([]);
    setTotalPrice(0);
  };

  return (
    <div>
      <PictureList pictures={pictures} handleBuyClick={handleBuyClick} />
      <ShoppingCart
        cartItems={cartItems}
        totalPrice={totalPrice}
        handlePayClick={handlePayClick}
        handleRemoveFromCart={handleRemoveFromCart}
      />
    </div>
  );
}

function PictureList({ pictures, handleBuyClick }) {
  return (
    <div>
      <h2>Available Pictures</h2>
      <div className="picture-grid">
        {pictures.map((picture) => (
          <div key={picture.id} className="picture-item">
            <img src={picture.src} alt={picture.id} />
            <p>Price: ${picture.price}</p>
            <button onClick={() => handleBuyClick(picture.id)}>Buy</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ShoppingCart({
  cartItems,
  totalPrice,
  handlePayClick,
  handleRemoveFromCart,
}) {
  return (
    <div>
      <h2>Shopping Cart</h2>
      <div className="cart-items">
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.src} alt={item.id} />
              <p>Price: ${item.price}</p>
              <button onClick={() => handleRemoveFromCart(item.id)}>
                Remove
              </button>
            </div>
          ))
        ) : (
          <p>Your cart is empty.</p>
        )}
      </div>
      <p className="cart-total">Total Price: ${totalPrice}</p>
      <button onClick={handlePayClick}>Pay</button>
    </div>
  );
}

export default App;
