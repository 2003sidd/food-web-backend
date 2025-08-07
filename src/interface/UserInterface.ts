import mongoose, {Document} from 'mongoose';

export default interface IUser extends Document {
    name:string,
    phoneNo:string ,
    password:string ,
    cartCount:Number,
    email:string,
    role:string,
    isActive:boolean,
    comparePassword(password: string): Promise<boolean>;
}