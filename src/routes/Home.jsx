import React from "react";
import Header from "../components/Header";
import RestaurantList from "../components/RestaurantList";
import AddRestaurant from "../components/AddRestaurant";


function Home() {
  return (
    <main className="container mx-auto p-4">
      <Header />
      <AddRestaurant />
      <RestaurantList />
    </main>
  );
}

export default Home;
