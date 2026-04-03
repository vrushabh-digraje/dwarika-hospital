import { VIDEOS as GLOBAL_VIDEOS } from '../lib/multimediaData';

const VIDEOS = [GLOBAL_VIDEOS[2]].filter(Boolean);

const VideoSection = () => {
    const video = VIDEOS[0];

    if (!video) return null;

    // This section has been disabled as per the user's request to remove the non-playing video.
    return null;
};

export default VideoSection;
