import {v2 as cloudinary, ConfigOptions} from 'cloudinary'
export default cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
    api_key: process.env.CLOUDINARY_API_KEY as string,
    api_secret: process.env.CLOUDINARY_API_SECRET as string
} as ConfigOptions) as ConfigOptions