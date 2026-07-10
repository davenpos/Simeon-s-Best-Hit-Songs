import cloudinary from '@/lib/cloudinary';

export default async function cloudinaryUpload(file: File) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise<{
    url: string;
    publicId: string;
  }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'simeons-best-hit-songs-covers',
      },
      (error, result) => {
        if (error || !result) {
          console.dir(error, { depth: null });
          reject(error);
          return;
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      },
    );

    stream.end(buffer);
  });
}
