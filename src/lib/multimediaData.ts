export interface VideoItem {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    videoUrl: string;
    category: 'Facility' | 'Testimonial' | 'Medical' | 'Academic';
    duration: string;
}

export const VIDEOS: VideoItem[] = [
    {
        id: 'v2',
        title: "Pediatric Care Success",
        category: "Testimonial",
        duration: "4:15",
        description: "An inspirational look at specialized pediatric care and cardiac excellence.",
        thumbnail: "https://images.unsplash.com/photo-1505751172157-c72658b918af?auto=format&fit=crop&q=80&w=1000",
        videoUrl: "https://www.youtube.com/embed/oIzUoVH8Nnc"
    },
    {
        id: 'v5',
        title: "Modern ICU & Critical Care",
        category: "Facility",
        duration: "5:30",
        description: "Explore our intensive care units featuring advanced monitoring and life support systems.",
        thumbnail: "https://images.unsplash.com/photo-1519494140681-891f9302e49d?auto=format&fit=crop&q=80&w=1000",
        videoUrl: "https://www.youtube.com/embed/cdNcF855260"
    },
    {
        id: 'v7',
        title: "Patient Recovery Stories",
        category: "Testimonial",
        duration: "6:45",
        description: "Hear from our patients about their journey to health and regular life after major surgery.",
        thumbnail: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=1000",
        videoUrl: "https://www.youtube.com/embed/51Ydnv3jLT4"
    },
];
