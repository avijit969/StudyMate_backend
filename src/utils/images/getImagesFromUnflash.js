import { createApi } from "unsplash-js"

const unsplash = createApi({
    accessKey: process.env.UNSPLASH_ACCESS_KEY || 'ZWqr5WWVZJi2xjG9zv9F3F_ccqZw8fGaEpioD0A2Vk4'
})
const getImageFromUnsplash = async (image) => {
    const response = unsplash.search.getPhotos({
        query: image,
        page: 1,
        perPage: 5
    })
    return (await response).response.results[0].urls.regular
}
export { getImageFromUnsplash }