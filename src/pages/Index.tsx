import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import VideoCard from "@/components/VideoCard";
import { Loader2 } from "lucide-react";

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  author: {
    name: string;
    avatar: string;
  };
  views: number;
  likes: number;
  dislikes: number;
  uploadedAt: Date;
  duration: number;
  isNsfw?: boolean;
  isNsfl?: boolean;
}

const Index = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Имитация загрузки рекомендаций от API
    const fetchRecommendedVideos = async () => {
      setLoading(true);
      try {
        // В реальном приложении здесь был бы API запрос
        // const response = await fetch('/api/recommendations');
        // const data = await response.json();
        
        // Имитация задержки сети
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Для демонстрации возвращаем пустой массив,
        // так как все видео должны быть только от пользователей
        setVideos([]);
      } catch (error) {
        console.error("Ошибка при загрузке рекомендаций:", error);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecommendedVideos();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Рекомендации</h1>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-green-600" />
          </div>
        ) : videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {videos.map((video) => (
              <VideoCard key={video.id} {...video} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-xl text-muted-foreground mb-4">Нет доступных рекомендаций</p>
            <p className="text-muted-foreground">
              Здесь будут отображаться видео от других пользователей.
              <br />
              Изучите разделы или загрузите свое первое видео!
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
