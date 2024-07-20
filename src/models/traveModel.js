import mongoose from "mongoose";
const { Schema } = mongoose;

export const travelSchema = new Schema({
  trip_details: {
    destination: { type: String, required: true },
    duration: { type: String, required: true },
    budget: { type: String, required: true },
    travelers: { type: String, required: true },
  },
  flight_details: {
    flight_provider: { type: String, required: true },
    flight_number: { type: String, required: true },
    departure_city: { type: String, required: true },
    arrival_city: { type: String, required: true },
    departure_date: { type: Date, required: true },
    return_date: { type: Date, required: true },
    price: { type: String, required: true },
    booking_url: { type: String, required: true },
  },
  hotel_options: [
    {
      name: { type: String, required: true },
      address: { type: String, required: true },
      price: { type: String, required: true },
      image_url: { type: String, required: true },
      geo_coordinates: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
      },
      rating: { type: Number, required: true },
      description: { type: String, required: true },
    },
  ],
  day_plans: [
    {
      day: { type: String, required: true },
      activities: [
        {
          time: { type: String, required: true },
          place_name: { type: String, required: true },
          place_details: { type: String, required: true },
          place_image_url: { type: String, required: true },
          geo_coordinates: {
            latitude: { type: Number, required: true },
            longitude: { type: Number, required: true },
          },
          ticket_pricing: { type: String, required: true },
          time_to_travel: { type: String, required: true },
        },
      ],
    },
  ],
});

const travelModel = mongoose.model("travel", travelSchema);

export default travelModel;
