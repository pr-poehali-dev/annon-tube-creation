import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import VideoCard from "@/components/VideoCard";
import { Loader2, Search as SearchIcon } from "lucide-react";

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
}

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const searchVideos = async () => {
      setLoading(true);
      try {
        // Имитация API-запроса поиска
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Для демо: создаем фиктивные результаты на основе запроса
        if (query) {
          const mockResults: Video[] = Array(5).fill(null).map((_, i) => ({
            id: `search-${i}-${Date.now()}`,
            title: `Результат по запросу "${query}" - видео ${i + 1}`,
            thumbnail: `https://source.unsplash.com/random/480x270?v=${i}&q=${encodeURIComponent(query)}`,
            author: {
              name: `Автор ${i + 1}`,
              avatar: `https://source.unsplash.com/random/64x64?face=${i}`,
            },
            views: Math.floor(Math.random() * 100000),
            likes: Math.floor(Math.random() * 10000),
            dislikes: Math.floor(Math.random() * 1000),
            uploadedAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)),
            duration: Math.floor(Math.random() * 600) + 60,
          }));
          setVideos(mockResults);
        } else {
          setVideos([]);
        }
      } catch (error) {
        console.error("Ошибка при поиске видео:", error);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };
    
    searchVideos();
  }, [query]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <SearchIcon className="h-6 w-6 text-green-600" />
          <h1 className="text-2xl font-bold">
            {query ? `Результаты поиска: ${query}` : 'Поиск'}
          </h1>
        </div>
        
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
            <p className="text-xl text-muted-foreground mb-4">
              {query ? `Ничего не найдено по запросу "${query}"` : 'Введите поисковый запрос'}
            </p>
            <p className="text-muted-foreground">
              Попробуйте другие ключевые слова или просмотрите рекомендуемые видео.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Search;
