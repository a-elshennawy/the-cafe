// add to cart
export const addToCart = (id) => {
  try {
    // Get existing items from localStorage
    const existingItems = localStorage.getItem("ordereditems");

    const itemsArray = existingItems ? JSON.parse(existingItems) : [];

    // Check if item already exists
    const itemExists = itemsArray.includes(id);

    if (itemExists) {
      // Item already in cart, do nothing
      console.log("Item already in cart, not adding");
      return false;
    }

    // Add new item to array
    itemsArray.push(id);

    // Save back to localStorage
    localStorage.setItem("ordereditems", JSON.stringify(itemsArray));
    console.log("Saved to localStorage:", JSON.stringify(itemsArray));

    return true;
  } catch (error) {
    console.error("Error adding item to cart:", error);
    return false;
  }
};

// getting ordered to view them
export const getCartItems = () => {};
