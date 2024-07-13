import mongoose from "mongoose";

export const travelSchema = new mongoose.Schema(
  {
    trip_details: {
      destination: String,
      duration: String,
      budget: String,
      travelers: String,
    },
    flight_details: {
      flight_provider: String,
      flight_number: String,
      departure_city: String,
      arrival_city: String,
      departure_date: Date,
      return_date: Date,
      price: String,
      booking_url: String,
    },
    hotel_options: [
      {
        name: String,
        address: String,
        price: String,
        image_url: String,
        geo_coordinates: {
          latitude: Number,
          longitude: Number,
        },
        rating: Number,
        description: String,
      },
    ],
    day_plans: [
      {
        day: String,
        activities: [
          {
            time: String,
            place_name: String,
            place_details: String,
            place_image_url: String,
            geo_coordinates: {
              latitude: Number,
              longitude: Number,
            },
            ticket_pricing: String,
            time_to_travel: String,
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

const travelmodel = new mongoose.model("travel", travelSchema);

export default travelmodel;
