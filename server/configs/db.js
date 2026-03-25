import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on("connected", () => {console.log("Database connected successfully!")})

        const mongodbURI = process.env.MONGODB_URI;
        const project_name ="resume-builder";

        if(!mongodbURI){
            throw new Error("MONGODB_URI environment variable not set");
        }

        if(mongodbURI.endsWith('/')){
            mongodbURI = mongodbURI.slice(0,-1)
        }

        await mongoose.connect(`${mongodbURI}/${project_name}`);
        
    } catch (error) {
        console.error("Error connecting to MongoDB:", error)
    }
}

export default connectDB;