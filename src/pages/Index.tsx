import Navbar from "@/components/Navbar";
import VideoCard from "@/components/VideoCard";

// Mock data for demonstration
const recommendedVideos = [
  {
    id: "video1",
    title: "How to Build a React Application from Scratch",
    thumbnail: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    author: {
      name: "CodeMaster",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    },
    views: 156000,
    likes: 12400,
    dislikes: 320,
    uploadedAt: new Date(2025, 2, 15),
    duration: 1840,
  },
  {
    id: "video2",
    title: "Advanced CSS Techniques Everyone Should Know",
    thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    author: {
      name: "WebDesignPro",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    },
    views: 98400,
    likes: 8700,
    dislikes: 230,
    uploadedAt: new Date(2025, 3, 10),
    duration: 1260,
  },
  {
    id: "video3",
    title: "The Future of AI Technology in 2025",
    thumbnail: "https://images.unsplash.com/photo-1677442135145-4d3e53586e20?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    author: {
      name: "TechInsight",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    },
    views: 352000,
    likes: 42300,
    dislikes: 1200,
    uploadedAt: new Date(2025, 3, 22),
    duration: 3600,
    isNsfw: false,
  },
  {
    id: "video4",
    title: "10 Hidden Features in JavaScript You Probably Don't Know",
    thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    author: {
      name: "JSNinja",
      avatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=100&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    },
    views: 127000,
    likes: 15800,
    dislikes: 350,
    uploadedAt: new Date(2025, 3, 5),
    duration: 2460,
  },
  {
    id: "video5",
    title: "Urban Exploration: Abandoned Mall After Dark",
    thumbnail: "https://images.unsplash.com/photo-1555448248-2571daf6344b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    author: {
      name: "UrbanAdventurer",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    },
    views: 89300,
    likes: 7600,
    dislikes: 420,
    uploadedAt: new Date(2025, 2, 28),
    duration: 5400,
    isNsfw: true,
  },
  {
    id: "video6",
    title: "Learn a New Language in 30 Days - My Experience",
    thumbnail: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    author: {
      name: "GlobalLearner",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    },
    views: 76500,
    likes: 9800,
    dislikes: 210,
    uploadedAt: new Date(2025, 3, 18),
    duration: 1740,
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Recommended for you</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {recommendedVideos.map((video) => (
            <VideoCard key={video.id} {...video} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
