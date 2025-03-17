import { create } from "zustand";
import RestaurantFinder from "../apis/RestaurantFinder";

const useRestaurantStore = create((set) => ({
  restaurants: [],
  isLoading: false,
  error: null,

  fetchData: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await RestaurantFinder.get("/");
      const data = response.data.data.restaurants;
      set({ restaurants: data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  addRestaurant: async (restaurant) => {
    try {
      const response = await RestaurantFinder.post("/", restaurant);
      const newRestaurant = response.data.data.restaurant;
      set((state) => ({
        restaurants: [...state.restaurants, newRestaurant],
      }));
    } catch (error) {
      console.error("Error adding restaurant:", error);
    }
  },

  updateRestaurant: async ({ id, image_url, rname, location, price_range }) => {
    try {
      const response = await RestaurantFinder.put(`/${id}`, {
        rname,
        location,
        price_range,
        image_url,
      });

      if (response.status === 200) {
        const updatedRestaurant = response.data.data;
        set((state) => ({
          restaurants: state.restaurants.map((restaurant) =>
            restaurant.id === id ? updatedRestaurant : restaurant
          ),
        }));
      }
    } catch (error) {
      console.error("Error updating restaurant:", error);
    }
  },

  removeRestaurant: async (id) => {
    try {
      await RestaurantFinder.delete(`/${id}`);
      set((state) => ({
        restaurants: state.restaurants.filter(
          (restaurant) => restaurant.id !== id
        ),
      }));
    } catch (error) {
      console.error("Error deleting restaurant:", error);
    }
  },
}));

export default useRestaurantStore;

