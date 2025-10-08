import express, { Request, Response } from 'express';
import cors from "cors"
import connectDb from './utility/db';
import dotenv from "dotenv"
import router from './route/authRoutes';
import orderRouter from './route/OrderRoutes';
import cartRoute from './route/cartRoute';
import categoryRoute from './route/CategoryRoutes';
import menuRoute from './route/menuRoute';
import addressRoute from './route/addressRoute';
import resturantRoute from './route/resturantRoute';
import { authorize } from './middelwares/jwt';
import ConfigModel from './models/config';
import wishlistRouter from './route/WishlistRoute';
import { sendMail } from './controller/user.controller';
dotenv.config();  // Load .env variables

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
// app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

// connection with mongo db database
connectDb();


app.use('/uploads', express.static('./uploads'));
app.use("/api/user", router)
app.use("/api/order", authorize(), orderRouter)
app.use("/api/cart", authorize(), cartRoute)
app.use("/api/category", authorize(), categoryRoute)
app.use("/api/menu", authorize(), menuRoute)
app.use("/api/address", authorize(), addressRoute)
app.use("/api/resturant", authorize(), resturantRoute)
app.use("/api/wishlist", authorize(), wishlistRouter)


app.get('/', (req: express.Request, res: express.Response) => {
    res.send('Hello, Express with TypeScript!');
});

app.get('/config', async (req: express.Request, res: express.Response) => {

    const config = await ConfigModel.find();
    res.json(config);

});

app.get("/mail", async (req: Request, res: Response) => {
    try {
        const data = await sendMail("Siddhant barman", "siddhantbarmanh@gmail.com")
        console.log("data", data);
        res.send(data)
    } catch (error) {
        console.log("error at index.js", error);
        res.send("serror")
    }
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

