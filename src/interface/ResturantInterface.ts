export default interface IRestaurant extends Document {
  name: string;
  address: string;
  phone_number: string;
  image: string;
  opening_hours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  created_at: Date;
  img: string;
  isActive: boolean
}
