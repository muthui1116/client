import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useRestaurantStore from "../stores/restaurantStore";
import RestaurantFinder from "../apis/RestaurantFinder";

const UpdateRestaurant = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateRestaurant, fetchData } = useRestaurantStore();

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [rname, setName] = useState("");
  const [location, setLocation] = useState("");
  const [price_range, setPriceRange] = useState("");

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await RestaurantFinder.get(`/${id}`);
        const restaurant = response.data.data.restaurant;
        setImagePreview(restaurant.image_url);
        setName(restaurant.rname);
        setLocation(restaurant.location);
        setPriceRange(restaurant.price_range);
      } catch (error) {
        console.error("Error fetching restaurant:", error);
      }
    };

    fetchRestaurant();
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const allowedTypes = ["image/jpeg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        alert("Only JPEG and PNG files are allowed.");
        return;
      }

      const maxSize = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSize) {
        alert("File size must be under 2MB.");
        return;
      }

      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }

      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);
    try {
      console.log("Uploading image...");
      const response = await fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        console.log("Image uploaded successfully:", data.data.image_url);
        return data.data.image_url;
      } else {
        console.error("Image upload failed:", data.error);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let finalImageUrl = imagePreview;
    if (image) {
      const uploadedUrl = await uploadImage(image);
      if (uploadedUrl) {
        finalImageUrl = uploadedUrl;
      }
    }

    try {
      await updateRestaurant({
        id,
        image_url: finalImageUrl,
        rname,
        location,
        price_range,
      });
      await fetchData();
      navigate("/");
    } catch (error) {
      console.error("Error updating restaurant:", error);
    }
  };

  return (
    <div className="container">
      <h2 className="mb-4">Update Restaurant</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group mt-3">
          <label htmlFor="image">Image</label>
          <input
            type="file"
            id="image"
            className="form-control"
            accept="image/png, image/jpeg"
            onChange={handleImageChange}
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-2"
              style={{ width: "150px", height: "auto", objectFit: "cover" }}
            />
          )}
        </div>
        <div className="form-group mt-3">
          <label htmlFor="rname">Name</label>
          <input
            type="text"
            id="rname"
            className="form-control"
            value={rname}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter restaurant name"
            required
          />
        </div>
        <div className="form-group mt-3">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            className="form-control"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter location"
            required
          />
        </div>
        <div className="form-group mt-3">
          <label htmlFor="price_range">Price Range</label>
          <input
            type="number"
            id="price_range"
            className="form-control"
            value={price_range}
            onChange={(e) => setPriceRange(e.target.value)}
            placeholder="Enter price range (1-5)"
            min="1"
            max="5"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          Submit
        </button>
      </form>
    </div>
  );
};

export default UpdateRestaurant;
