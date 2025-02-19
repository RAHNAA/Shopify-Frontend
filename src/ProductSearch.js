import React, { useState } from "react";

const ProductSearch = () => {
  const [productId, setProductId] = useState("");
  const [product, setProduct] = useState(null);
  const [addons, setAddons] = useState({ gift__wrapping: false, _warranty: false });
  const [selectedAddon, setSelectedAddon] = useState({ gift__wrapping: false, _warranty: false });

  
  const fetchProduct = async () => {
    if (!productId) return;

    try {
      const response = await fetch(`https://shopify-app-test-sbdq.onrender.com/product/${productId}`);
      if (!response.ok) throw new Error("Product not found");

      const data = await response.json();
      setProduct(data);

      
      const addonsResponse = await fetch(`https://shopify-app-test-sbdq.onrender.com/product/${productId}/addons`);
      const addonsData = await addonsResponse.json();
      setAddons(addonsData.addons);

      
      setSelectedAddon({
        gift__wrapping: addonsData.addons.gift__wrapping,
        _warranty: addonsData.addons._warranty,
      });
    } catch (error) {
      console.error("Error fetching product:", error);
      setProduct(null);
      setAddons({ gift__wrapping: false, _warranty: false });
    }
  };

  
  const handleAddonChange = (addonKey) => {
    const newSelectedAddon = { ...selectedAddon, [addonKey]: !selectedAddon[addonKey] };
    setSelectedAddon(newSelectedAddon);

    
    saveAddon(addonKey, newSelectedAddon[addonKey]);
  };

 
  const saveAddon = async (addonKey, addonValue) => {
    try {
      const response = await fetch(`https://shopify-app-test-sbdq.onrender.com/product/${productId}/addons`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addonKey, addonValue }),  
      });

      if (!response.ok) throw new Error("Failed to save add-on");

      alert("Add-on updated successfully");
    } catch (error) {
      console.error("Error saving add-on:", error);
    }
  };

  return (
    <div>
      <h2>Search for a Product</h2>
      <input
        type="text"
        placeholder="Enter Product ID"
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
      />
      <button onClick={fetchProduct}>Search</button>

      {product && (
        <div>
          <h3>{product.title}</h3>
          <img src={product.image?.src} alt={product.title} width="150" />
          <p>Price: ${product.variants[0]?.price}</p>

          <h3>Available Add-ons</h3>
          <div>
            <label>
              <input
                type="checkbox"
                checked={selectedAddon.gift__wrapping}
                onChange={() => handleAddonChange("gift__wrapping")}
              />
              Gift Wrap
            </label>
            <br />
            <label>
              <input
                type="checkbox"
                checked={selectedAddon._warranty}
                onChange={() => handleAddonChange("_warranty")}
              />
              Extended Warranty
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductSearch;
