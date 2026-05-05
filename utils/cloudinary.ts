export const uploadToCloudinary = async (uri: string): Promise<string> => {
  const data = new FormData();
  data.append("file", { uri, type: "image/jpeg", name: "upload.jpg" } as any);
  data.append("upload_preset", "YOUR_PRESET");
  const res = await fetch(
    "https://api.cloudinary.com/v1_1/YOUR_CLOUD/image/upload",
    {
      method: "POST",
      body: data,
    },
  );
  const json = await res.json();
  return json.secure_url;
};
