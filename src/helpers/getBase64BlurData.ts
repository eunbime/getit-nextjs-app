export const getBase64BlurData = async (imageUrl: string) => {
  const response = await fetch(
    imageUrl.replace(
      "/upload/",
      "/upload/w_300,h_300,c_fill,e_blur:200,f_jpg,q_1/"
    )
  );
  const buffer = await response.arrayBuffer();
  const base64 = Buffer.from(buffer).toString("base64");
  return `data:image/jpeg;base64,${base64}`;
};

export async function generateBlurDataURL(url: string) {
  return await getBase64BlurData(url);
}
