import axios from "axios";

export const getYouTubeVideoByTopic = async (topicTitle) => {
    const apiKey = "AIzaSyD6ZD6GG_DbEwmBXTDUdmalNoNJOIm_hXk";
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?q=${encodeURIComponent(topicTitle)}&part=snippet&type=video&key=${apiKey}`;

    try {
        const response = await axios.get(searchUrl);
        if (response.data.items.length > 0) {
            return `https://www.youtube.com/watch?v=${response.data.items[0].id.videoId}`;
        }
        return null;
    } catch (error) {
        console.error("Error fetching YouTube video:", error);
        return null;
    }
};
