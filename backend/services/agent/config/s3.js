//configuration for s3 client
//we are using @aws-sdk/client-s3 v3
//this is the new way to use s3 in js


import { S3Client} from "@aws-sdk/client-s3";

export const s3=new S3Client({
    region:process.env.AWS_REGION,
    credentials:{
        accessKeyId:process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey:process.env.AWS_SECRET_KEY
    }
})