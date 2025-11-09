export const getBrandImageUrl = (fileName?: string) => {
    if (!fileName) return "";
    if (fileName.startsWith("http")) return fileName;
    return `https://imagedelivery.net/1J0pLjFdKJBzEdIlr1bDRQ/${fileName}/public`;
};
