import mongoose, { Schema } from "mongoose";


const providerSchema = new mongoose.Schema(
  {
    id: String,
    email: String,
    linkedAt: Date,
  },
  { _id: false } // prevents MongoDB from creating extra _id in subdocument
);

const userSchema=mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    phone:{type:String},
     providers: {
    google: { type: providerSchema, default: undefined }, // ✅ correct place
  },
  //   providers: {
  //   google: {
  //     id: String,
  //     email: String,
  //     linkedAt: Date,
  //     default:undefined,
  //   }
  // }
})

const userModel=mongoose.model.user || mongoose.model("user",userSchema)

export default userModel;