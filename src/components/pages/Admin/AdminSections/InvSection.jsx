import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";

export default function InvSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // form states
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("cold drinks");
  const [price, setPrice] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // fetch product on component mount
  useEffect(() => {
    fetchProducts();

    const channel = supabase
      .channel("products_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "products",
        },
        (payload) => {
          console.log("products changed:", payload);
          fetchProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fetchProducts = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("error fetching products:", error.message);
      setError(error.message);
    } else {
      setProducts(data || []);
    }

    setLoading(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      // validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }
      // validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }
      setImageFile(file);
      setError(null);
    }
  };

  const uploadImage = async (file) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()
      .toString(36)
      .substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { data, error } = await supabase.storage
      .from("products_imgs")
      .upload(filePath, file);

    if (error) {
      throw error;
    }

    // get public url
    const { data: urlData } = supabase.storage
      .from("products_imgs")
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setUploading(true);

    try {
      // check session first
      const {
        data: { session },
      } = await supabase.auth.getSession();
      console.log("Current session:", session);

      if (!session) {
        setError("You must be logged in to add products");
        setUploading(false);
        return;
      }

      console.log("User is authenticated:", session.user.email);

      // validate inputs
      if (!name.trim()) {
        setError("Product name is required");
        setUploading(false);
        return;
      }
      if (!price || price <= 0) {
        setError("Valid price is required");
        setUploading(false);
        return;
      }
      if (!imageFile) {
        setError("Product image is required");
        setUploading(false);
        return;
      }
      // Upload image first
      const imageUrl = await uploadImage(imageFile);

      // insert product record
      const { data, error } = await supabase
        .from("products")
        .insert([
          {
            name: name.trim(),
            desc: desc.trim(),
            category: category,
            price: parseInt(price),
            image_url: imageUrl,
          },
        ])
        .select();
      if (error) {
        throw error;
      }

      setSuccess("Product added successfully");

      // Reset form
      setName("");
      setDesc("");
      setCategory("cold drinks");
      setPrice("");
      setImageFile(null);
      // Reset file input
      e.target.reset();

      // Refresh products list
      fetchProducts();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error adding product:", err);
      setError(err.message || "Failed to add product");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id, imageUrl) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const { data, error } = await supabase
        .from("products")
        .delete()
        .eq("id", id)
        .select();

      if (error) {
        throw error;
      }

      // Delete image from storage if exists
      if (imageUrl) {
        const filePath = imageUrl.split("/products_imgs/")[1];
        if (filePath) {
          await supabase.storage.from("products_imgs").remove([filePath]);
        }
      }

      setSuccess("Product deleted successfully");

      // Refresh the products list
      fetchProducts();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error deleting product:", err);
      setError(err.message || "Failed to delete product");
    }
  };

  const handleEdit = (product) => {
    // populate form with product data
    setName(product.name);
    setDesc(product.desc || "");
    setCategory(product.category);
    setPrice(product.price);
    setEditingProduct(product);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setUploading(true);

    try {
      // check session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setError("You must be logged in to update products");
        setUploading(false);
        return;
      }

      // Validate inputs
      if (!name.trim()) {
        setError("Product name is required");
        setUploading(false);
        return;
      }
      if (!price || price <= 0) {
        setError("Valid price is required");
        setUploading(false);
        return;
      }

      let imageUrl = editingProduct.image_url; // Keep existing image by default

      // If user selected a new image, upload it
      if (imageFile) {
        // Delete old image first
        const oldFilePath =
          editingProduct.image_url.split("/products_imgs/")[1];
        if (oldFilePath) {
          await supabase.storage.from("products_imgs").remove([oldFilePath]);
        }

        // Upload new image
        imageUrl = await uploadImage(imageFile);
      }

      // Update product in database
      const { error } = await supabase
        .from("products")
        .update({
          name: name.trim(),
          desc: desc.trim(),
          category: category,
          price: parseInt(price),
          image_url: imageUrl,
        })
        .eq("id", editingProduct.id);

      if (error) throw error;

      setSuccess("Product updated successfully");

      // Reset form
      setName("");
      setDesc("");
      setCategory("cold drinks");
      setPrice("");
      setImageFile(null);
      setEditingProduct(null); // Clear editing state
      e.target.reset();

      // Refresh products list
      fetchProducts();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error checking session:", err);
      setError(err.message || "Failed to verify session");
      setUploading(false);
      return;
    }
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setName("");
    setDesc("");
    setCategory("cold drinks");
    setPrice("");
    setImageFile(null);
    setError(null);
  };

  return (
    <>
      <div className="InvSection py-3 px-0 col-12 row justify-content-center align-items-start m-0 gap-2">
        <form
          className="crudForm p-2 col-lg-4 col-md-5 col-12"
          onSubmit={editingProduct ? handleUpdate : handleSubmit}
        >
          <div className="searchContainer text-start py-1">
            <input
              className="prodSearch"
              type="search"
              placeholder="search product name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery("")}>
                Clear
              </button>
            )}
          </div>
          {error && (
            <div className="alert alert-danger p-2 my-2" role="alert">
              {error}
            </div>
          )}
          {success && (
            <div className="alert alert-success p-2 my-2" role="alert">
              {success}
            </div>
          )}
          <div className="inputContainer p-0 my-2">
            <input
              type="text"
              placeholder="product name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="inputContainer p-0 my-2">
            <input
              type="text"
              placeholder="product description"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>
          <div className="inputContainer p-0 my-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="cold drinks">cold drinks</option>
              <option value="hot drinks">hot drinks</option>
              <option value="food">food</option>
            </select>
          </div>
          <div className="inputContainer p-0 my-2">
            <input
              type="number"
              placeholder="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min="1"
              required
            />
          </div>
          <div className="inputContainer p-0 my-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required={!editingProduct}
            />
            {editingProduct && (
              <small className="text-white d-block mt-1">
                Leave empty to keep current image
              </small>
            )}
          </div>
          <div className="p-0 my-2">
            <button type="submit" disabled={uploading}>
              {uploading
                ? editingProduct
                  ? "Updating..."
                  : "Adding..."
                : editingProduct
                ? "Update"
                : "Submit"}
            </button>
            {editingProduct && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="btn-cancel"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
        <div className="productSide p-0 col-lg-6 col-md-5 col-12 row justify-content-center align-items-center m-0 gap-2">
          {loading ? (
            <p className="text-center">Loading products...</p>
          ) : filteredProducts.length === 0 ? (
            <p className="text-center">
              {searchQuery
                ? `No products found for "${searchQuery}"`
                : "No products yet. Add your first product!"}
            </p>
          ) : (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className="prodItem p-0 col-lg-3 col-md-5 col-5"
              >
                <div className="img">
                  <img
                    src={
                      product.image_url ||
                      "/public/images/StockImages/Coffee.png"
                    }
                    alt={product.name}
                    style={{ width: "100%", height: "auto" }}
                  />
                </div>
                <div className="details p-2">
                  <h4 className="m-0 pb-1">{product.name}</h4>
                  <h5 className="m-0 p-0">{product.price} EGP</h5>
                </div>
                <div className="actions pb-2 px-2">
                  <button onClick={() => handleEdit(product)}>edit</button>
                  <button
                    onClick={() => handleDelete(product.id, product.image_url)}
                  >
                    delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
