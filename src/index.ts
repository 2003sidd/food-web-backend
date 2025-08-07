import express from 'express';
import path from 'path';
import cors from "cors"
import connectDb from './utility/db';
import router from './route/authRoutes';
import orderRouter from './route/OrderRoutes';
import dotenv from "dotenv"
import cartRoute from './route/cartRoute';
import categoryRoute from './route/CategoryRoutes';
import menuRoute from './route/menuRoute';
import addressRoute from './route/addressRoute';
import resturantRoute from './route/resturantRoute';
import { authorize } from './middelwares/jwt';
dotenv.config();  // Load .env variables

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
// app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

// connection with mongo db database
connectDb();



app.use("/api/user",router)
app.use("/api/order",orderRouter)
app.use("/api/cart",cartRoute)
app.use("/api/category",categoryRoute)
app.use("/api/menu",authorize(), menuRoute)
app.use("/api/address",addressRoute)
app.use("/api/resturant",resturantRoute)


app.get('/', (req: express.Request, res: express.Response) => {
    res.send('Hello, Express with TypeScript!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

