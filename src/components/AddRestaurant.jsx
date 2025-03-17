import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useRestaurantStore from "../stores/restaurantStore";

const AddRestaurant = () => {
  const [rname, setRname] = useState("");
  const [location, setLocation] = useState("");
  const [priceRange, setPriceRange] = useState("1");
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // New: Store error message

  const { addRestaurant } = useRestaurantStore();
  const navigate = useNavigate();

  const uploadImage = async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);
    
    try {
      console.log("Uploading image...");
      const response = await fetch("https://client-production-e94d.up.railway.app/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (response.ok) {
        console.log("Image uploaded successfully:", data.data.image_url);
        return data.data.image_url;
      } else {
        console.error("Image upload failed:", data.error);
        setErrorMessage(data.error); // New: Display error message
        return null;
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setErrorMessage("Failed to upload image. Please try again.");
      return null;
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear previous errors

    let imageUrl = "";
    if (image) {
      imageUrl = await uploadImage(image);
      if (!imageUrl) {
        console.error("Image upload failed, aborting restaurant addition");
        return;
      }
    }

    const newRestaurant = {
      rname,
      location,
      price_range: priceRange,
      image_url: imageUrl,
    };

    try {
      console.log("Adding restaurant...", newRestaurant);
      await addRestaurant(newRestaurant);
      window.location.reload();
    } catch (error) {
      console.error("Error adding restaurant:", error);
      setErrorMessage("Failed to add restaurant. Please try again.");
    }
  };

  return (
    <div className="container">
      <h2 className="mb-4">Add a New Restaurant</h2>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>} {/* New: Error message display */}
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="mb-3 col">
            <input
              type="text"
              className="form-control"
              value={rname}
              onChange={(e) => setRname(e.target.value)}
              required
              placeholder="Restaurant Name"
            />
          </div>
          <div className="mb-3 col">
            <input
              type="text"
              className="form-control"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              placeholder="Location"
            />
          </div>
          <div className="mb-3 col">
            <select
              className="form-select"
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
            >
              <option value="1">$</option>
              <option value="2">$$</option>
              <option value="3">$$$</option>
              <option value="4">$$$$</option>
              <option value="5">$$$$$</option>
            </select>
          </div>
          <div className="mb-3 col">
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={(e) => {
                setErrorMessage(""); // Clear previous errors
                const file = e.target.files[0];

                if (file) {
                  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
                  const maxSize = 2 * 1024 * 1024; // 2MB

                  if (!allowedTypes.includes(file.type)) {
                    setErrorMessage("Invalid file type. Only JPEG, PNG, and GIF are allowed.");
                    return;
                  }
                  if (file.size > maxSize) {
                    setErrorMessage("File is too large. Maximum size is 2MB.");
                    return;
                  }

                  if (previewUrl) {
                    URL.revokeObjectURL(previewUrl);
                  }
                  setImage(file);
                  setPreviewUrl(URL.createObjectURL(file));
                }
              }}
            />
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                style={{
                  width: "100px",
                  height: "100px",
                  marginTop: "10px",
                  objectFit: "cover",
                }}
              />
            )}
          </div>
          <div className="mb-3 col">
            <button type="submit" className="btn btn-primary">
              Add Restaurant
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddRestaurant;
