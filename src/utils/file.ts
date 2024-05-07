export const convertSrcToFile = async (
  src: string,
  fileName: string
): Promise<File> => {
  const response = await fetch(src);
  const blob = await response.blob();
  return new File([blob], fileName, { type: blob.type });
};
