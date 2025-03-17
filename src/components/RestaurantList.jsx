// components/RestaurantList.js
import React, { useEffect } from "react";
import useRestaurantStore from "../stores/restaurantStore";
import { useNavigate } from "react-router-dom";

const RestaurantList = () => {
  const { restaurants, fetchData, isLoading, removeRestaurant } = useRestaurantStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await removeRestaurant(id);
    } catch (error) {
      console.error("Error deleting restaurant:", error);
    }
  };

  const handleEdit = (id) => {
    navigate(`/restaurants/${id}/update`);
  };

  return (
    <div className="container">
      <h2 className="mb-4">Restaurant List</h2>
      {isLoading && <div>Loading ...</div>}
      {!isLoading && restaurants.length === 0 && (
        <div>No restaurants found. Please add a restaurant.</div>
      )}
      {restaurants.length > 0 && (
        <table className="table table-dark table-hover">
          <thead>
            <tr>
              <th scope="col">Image</th>
              <th scope="col">Name</th>
              <th scope="col">Location</th>
              <th scope="col">Price Range</th>
              <th scope="col">Edit</th>
              <th scope="col">Delete</th>
            </tr>
          </thead>
          <tbody>
            {restaurants && restaurants.map((restaurant) => (
              <tr key={restaurant.id}>
                <td>
                  {restaurant.image_url ? (
                    <img
                      src={`https://client-production-e94d.up.railway.app/${restaurant.image_url}`}
                      alt={restaurant.rname}
                      width="100px"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/fallback-image.jpg";
                      }}
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td>{restaurant.rname}</td>
                <td>{restaurant.location}</td>
                <td>{restaurant.price_range}</td>
                <td>
                  <button className="btn btn-primary" onClick={() => handleEdit(restaurant.id)}>
                    Edit
                  </button>
                </td>
                <td>
                  <button className="btn btn-danger" onClick={() => handleDelete(restaurant.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RestaurantList;
