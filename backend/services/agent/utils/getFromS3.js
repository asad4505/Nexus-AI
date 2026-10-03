// This code is a cloud storage retrieval utility that generates a temporary, cryptographically signed URL (Presigned URL) to securely download or read an object from a private Amazon S3 bucket.
//A specialized utility from AWS SDK v3 dedicated to signing AWS requests with temporary authentication signatures.
//S3Client holding your AWS IAM credentials and region configuration.
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "../config/s3.js";
import { GetObjectCommand } from "@aws-sdk/client-s3";//specifies the target bucket and file key to fetch

export const getFromS3=async (filename,expiresIn=600)=>{
  return await getSignedUrl(//takes the preconfigured client, the command, and expiration settings
    s3,
    new GetObjectCommand({
        Bucket:process.env.AWS_BUCKET_NAME,
        Key:filename
    }
    ),
    {expiresIn}
  )
}