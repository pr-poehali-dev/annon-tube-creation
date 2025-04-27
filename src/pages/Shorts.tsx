import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronUp, ChevronDown, Heart, MessageSquare, Share2, User, Music } from "lucide-react";

interface ShortVideo {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  audioTrack: string;
  likes: number;
  comments: number;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  isNsfw?: boolean;
}

// Пустой массив видео
const mockShorts: ShortVideo[] = [];

const Shorts = () => {
  const { shortId } = useParams();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shorts, setShorts] = useState<ShortVideo[]>(mockShorts);
  const [isLiked, setIsLiked] = useState<Record<string, boolean>>({});
  const [isPlaying, setIsPlaying] = useState(true);
  
  // Определяем начальный индекс на основе ID из URL
  useEffect(() => {
    if (shortId) {
      const index = shorts.findIndex(short => short.id === shortId);
      if (index !== -1) {
        setCurrentIndex(index);
      }
    }
  }, [shortId, shorts]);

  // Обновляем URL при изменении индекса
  useEffect(() => {
    if (shorts[currentIndex]) {
      navigate(`/shorts/${shorts[currentIndex].id}`, { replace: true });
    }
  }, [currentIndex, navigate, shorts]);

  const handleVideoClick = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (currentIndex < shorts.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsPlaying(true); // Автоматически начинаем воспроизведение при переходе к следующему видео
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsPlaying(true); // Автоматически начинаем воспроизведение при переходе к предыдущему видео
    }
  };

  const toggleLike = (id: string) => {
    setIsLiked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Обработчик прокрутки для мобильных устройств
  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY > 0) {
      handleNext();
    } else {
      handlePrev();
    }
  };

  // Обработчик свайпа для мобильных устройств
  const touchStartY = useRef(0);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY.current - touchEndY;
    
    if (Math.abs(diff) > 50) { // Минимальное расстояние для свайпа
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  if (shorts.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)]">
          <p className="text-xl mb-4">Нет доступных коротких видео</p>
          <Button onClick={() => navigate("/upload")}>Загрузить Shorts</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div 
        className="relative h-[calc(100vh-64px)] overflow-hidden"
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {shorts.map((short, index) => (
          <div 
            key={short.id}
            className={`absolute inset-0 transition-transform duration-500 ${
              index === currentIndex ? "translate-y-0" : 
              index < currentIndex ? "-translate-y-full" : "translate-y-full"
            }`}
          >
            <div className="relative h-full w-full flex justify-center bg-black">
              {/* Заглушка видео */}
              <div 
                className="relative max-w-md w-full h-full" 
                onClick={handleVideoClick}
              >
                <img
                  src={short.videoUrl}
                  alt={short.title}
                  className="w-full h-full object-cover"
                />
                
                {!isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div className="w-20 h-20 rounded-full bg-black/50 flex items-center justify-center">
                      <div className="w-0 h-0 border-t-[15px] border-t-transparent border-l-[25px] border-l-white border-b-[15px] border-b-transparent ml-2"></div>
                    </div>
                  </div>
                )}
                
                {short.isNsfw && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded">
                    NSFW
                  </div>
                )}
                
                {/* Интерфейс для короткого видео */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex items-end justify-between">
                    <div className="text-white max-w-[80%]">
                      <h3 className="font-bold text-lg mb-1">{short.title}</h3>
                      <div className="flex items-center space-x-2 mb-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={short.author.avatar} />
                          <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                        </Avatar>
                        <span>@{short.author.name}</span>
                      </div>
                      <p className="text-sm mb-3 line-clamp-2">{short.description}</p>
                      <div className="flex items-center space-x-2 text-xs">
                        <Music className="h-3 w-3" />
                        <span className="truncate max-w-[200px]">{short.audioTrack}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center space-y-6 text-white">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="rounded-full bg-black/30 text-white hover:bg-black/50"
                        onClick={() => toggleLike(short.id)}
                      >
                        <Heart 
                          className={`h-6 w-6 ${isLiked[short.id] ? "fill-red-500 text-red-500" : ""}`} 
                        />
                        <span className="text-xs mt-1">{isLiked[short.id] ? short.likes + 1 : short.likes}</span>
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="rounded-full bg-black/30 text-white hover:bg-black/50"
                      >
                        <MessageSquare className="h-6 w-6" />
                        <span className="text-xs mt-1">{short.comments}</span>
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="rounded-full bg-black/30 text-white hover:bg-black/50"
                      >
                        <Share2 className="h-6 w-6" />
                        <span className="text-xs mt-1">Share</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Навигационные стрелки */}
        <Button 
          variant="ghost" 
          size="icon" 
          className={`absolute top-1/2 left-4 -translate-y-1/2 rounded-full bg-black/30 text-white hover:bg-black/50 ${currentIndex === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          <ChevronUp className="h-8 w-8" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className={`absolute bottom-1/2 left-4 translate-y-1/2 rounded-full bg-black/30 text-white hover:bg-black/50 ${currentIndex === shorts.length - 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
          onClick={handleNext}
          disabled={currentIndex === shorts.length - 1}
        >
          <ChevronDown className="h-8 w-8" />
        </Button>
      </div>
    </div>
  );
};

export default Shorts;
