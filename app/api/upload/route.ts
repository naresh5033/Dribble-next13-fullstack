import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

// create the cloudinary(v2 ) instance
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export async function POST(request: Request) {
  const { path } = await request.json(); // this path is the option that we pass while making this req

  if (!path) {
    return NextResponse.json({ message: "Image path is required" }, { status: 400 });
  }

  try { //this option(obj) is for the cloudinary
    const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: true,
      transformation: [{ width: 1000, height: 752, crop: "scale" }],
    };

    const result = await cloudinary.uploader.upload(path, options);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to upload image on Cloudinary" }, { status: 500 });
  }
} //now we re uploading the img to the cloudinary, we can make finalize this call to the api upload in the actions
