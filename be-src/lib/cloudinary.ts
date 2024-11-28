import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "dbx7dwghv",
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET, // Click 'View API Keys' above to copy your API secret
});

export { cloudinary };
