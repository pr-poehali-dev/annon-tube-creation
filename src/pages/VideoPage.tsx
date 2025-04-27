import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ThumbsUp, ThumbsDown, MessageSquare, User, Share2, Flag, Clock, Tag } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Заглушка для демонстрации
const mockVideos = {
  "video1": {
    id: "video1",
    title: "How to Build a React Application from Scratch",
    description: "В этом видео я показываю, как создать полноценное React-приложение с нуля. Мы рассмотрим настройку проекта, компоненты, маршрутизацию и многое другое.",
    videoUrl: "https://example.com/video1.mp4", // В реальности здесь будет настоящий URL
    thumbnail: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    author: {
      id: "user1",
      name: "CodeMaster",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      subscribers: 45600
    },
    views: 156000,
    likes: 12400,
    dislikes: 320,
    uploadedAt: new Date(2025, 2, 15),
    duration: 1840,
    tags: ["react", "javascript", "programming", "webdev"],
    comments: [
      {
        id: "c1",
        author: {
          name: "WebDevFan",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
        },
        content: "Очень полезное видео! Спасибо за подробное объяснение.",
        likes: 120,
        dislikes: 2,
        timestamp: new Date(2025, 2, 16),
        replies: [
          {
            id: "r1",
            author: {
              name: "CodeMaster",
              avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
            },
            content: "Рад, что вам понравилось! Планирую сделать продолжение.",
            likes: 45,
            dislikes: 0,
            timestamp: new Date(2025, 2, 16)
          }
        ]
      },
      {
        id: "c2",
        author: {
          name: "ReactLearner",
          avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
        },
        content: "На какой минуте рассказывается про хуки? Не могу найти.",
        likes: 30,
        dislikes: 0,
        timestamp: new Date(2025, 2, 18),
        replies: []
      }
    ]
  },
  "video2": {
    id: "video2",
    title: "Advanced CSS Techniques Everyone Should Know",
    description: "Продвинутые техники CSS, которые должен знать каждый веб-разработчик.",
    videoUrl: "https://example.com/video2.mp4",
    thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    author: {
      id: "user2",
      name: "WebDesignPro",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      subscribers: 32400
    },
    views: 98400,
    likes: 8700,
    dislikes: 230,
    uploadedAt: new Date(2025, 3, 10),
    duration: 1260,
    tags: ["css", "webdesign", "frontend"],
    comments: []
  }
};

const VideoPage = () => {
  const { videoId } = useParams();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasDisliked, setHasDisliked] = useState(false);
  
  const video = mockVideos[videoId as keyof typeof mockVideos];
  
  if (!video) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Видео не найдено</h1>
        <p className="mb-6">Запрошенное видео не существует или было удалено.</p>
        <Button asChild><Link to="/">Вернуться на главную</Link></Button>
      </div>
    );
  }
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };
  
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };
  
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };
  
  const handleLike = () => {
    if (hasDisliked) setHasDisliked(false);
    setHasLiked(!hasLiked);
  };
  
  const handleDislike = () => {
    if (hasLiked) setHasLiked(false);
    setHasDisliked(!hasDisliked);
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {/* Видеоплеер (заглушка) */}
            <div className="relative aspect-video bg-card rounded-lg overflow-hidden mb-4">
              <img 
                src={video.thumbnail} 
                alt={video.title} 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <p className="text-white">▶️ Заглушка для видеоплеера</p>
              </div>
              <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 text-sm rounded">
                {formatDuration(video.duration)}
              </div>
            </div>
            
            {/* Информация о видео */}
            <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
            <div className="flex flex-wrap justify-between items-center mb-4">
              <div className="flex items-center space-x-4">
                <Link to={`/channel/${video.author.id}`} className="flex items-center space-x-2">
                  <Avatar>
                    <AvatarImage src={video.author.avatar} alt={video.author.name} />
                    <AvatarFallback>{video.author.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{video.author.name}</p>
                    <p className="text-sm text-muted-foreground">{formatNumber(video.author.subscribers)} подписчиков</p>
                  </div>
                </Link>
                <Button 
                  variant={isSubscribed ? "default" : "outline"} 
                  className={isSubscribed ? "bg-green-600 hover:bg-green-700" : ""} 
                  onClick={() => setIsSubscribed(!isSubscribed)}
                >
                  {isSubscribed ? "Вы подписаны" : "Подписаться"}
                </Button>
              </div>
              
              <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`flex items-center space-x-1 ${hasLiked ? "bg-green-100 border-green-300" : ""}`}
                  onClick={handleLike}
                >
                  <ThumbsUp className={`h-4 w-4 ${hasLiked ? "text-green-600" : ""}`} />
                  <span>{formatNumber(hasLiked ? video.likes + 1 : video.likes)}</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`flex items-center space-x-1 ${hasDisliked ? "bg-red-100 border-red-300" : ""}`}
                  onClick={handleDislike}
                >
                  <ThumbsDown className={`h-4 w-4 ${hasDisliked ? "text-red-600" : ""}`} />
                  <span>{formatNumber(hasDisliked ? video.dislikes + 1 : video.dislikes)}</span>
                </Button>
                <Button variant="outline" size="sm" className="flex items-center space-x-1">
                  <Share2 className="h-4 w-4" />
                  <span>Поделиться</span>
                </Button>
                <Button variant="outline" size="sm" className="flex items-center space-x-1">
                  <Flag className="h-4 w-4" />
                  <span>Пожаловаться</span>
                </Button>
              </div>
            </div>
            
            {/* Детали видео */}
            <div className="bg-card p-4 rounded-lg mb-6">
              <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                <span className="flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>{formatNumber(video.views)} просмотров</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatDate(video.uploadedAt)}</span>
                </span>
              </div>
              
              {video.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {video.tags.map((tag, index) => (
                    <Link 
                      key={index} 
                      to={`/search?q=${tag}`} 
                      className="bg-muted px-2 py-1 rounded text-xs flex items-center space-x-1"
                    >
                      <Tag className="h-3 w-3" />
                      <span>{tag}</span>
                    </Link>
                  ))}
                </div>
              )}
              
              <p className="whitespace-pre-line">{video.description}</p>
            </div>
            
            {/* Комментарии */}
            <Tabs defaultValue="comments">
              <TabsList className="mb-4">
                <TabsTrigger value="comments">
                  Комментарии ({video.comments.length})
                </TabsTrigger>
                <TabsTrigger value="related">
                  Похожие видео
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="comments">
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <Avatar>
                      <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" />
                      <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <textarea 
                        className="w-full border rounded-lg p-2 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-green-300"
                        placeholder="Добавить комментарий..."
                      />
                      <div className="flex justify-end mt-2">
                        <Button>Отправить</Button>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {video.comments.map((comment) => (
                    <div key={comment.id} className="space-y-4">
                      <div className="flex items-start space-x-4">
                        <Avatar>
                          <AvatarImage src={comment.author.avatar} />
                          <AvatarFallback>{comment.author.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{comment.author.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(comment.timestamp)}
                            </span>
                          </div>
                          <p className="mt-1">{comment.content}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <Button variant="ghost" size="sm" className="h-8 px-2">
                              <ThumbsUp className="h-4 w-4 mr-1" />
                              <span>{comment.likes}</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 px-2">
                              <ThumbsDown className="h-4 w-4 mr-1" />
                              <span>{comment.dislikes}</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 px-2">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              <span>Ответить</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Ответы на комментарий */}
                      {comment.replies.length > 0 && (
                        <div className="ml-12 space-y-4">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="flex items-start space-x-4">
                              <Avatar>
                                <AvatarImage src={reply.author.avatar} />
                                <AvatarFallback>{reply.author.name.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium">{reply.author.name}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {formatDate(reply.timestamp)}
                                  </span>
                                </div>
                                <p className="mt-1">{reply.content}</p>
                                <div className="flex items-center space-x-4 mt-2">
                                  <Button variant="ghost" size="sm" className="h-8 px-2">
                                    <ThumbsUp className="h-4 w-4 mr-1" />
                                    <span>{reply.likes}</span>
                                  </Button>
                                  <Button variant="ghost" size="sm" className="h-8 px-2">
                                    <ThumbsDown className="h-4 w-4 mr-1" />
                                    <span>{reply.dislikes}</span>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="related">
                <div className="grid grid-cols-1 gap-4">
                  <p className="text-muted-foreground">Похожие видео будут отображаться здесь.</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Правая колонка с рекомендациями */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-medium mb-4">Рекомендуемые видео</h3>
            <div className="space-y-4">
              {Object.values(mockVideos)
                .filter(v => v.id !== video.id)
                .map((relatedVideo) => (
                  <Link 
                    key={relatedVideo.id}
                    to={`/video/${relatedVideo.id}`}
                    className="flex space-x-2 hover:bg-muted p-2 rounded-lg transition-colors"
                  >
                    <div className="relative w-40 h-24 flex-shrink-0">
                      <img 
                        src={relatedVideo.thumbnail} 
                        alt={relatedVideo.title} 
                        className="w-full h-full object-cover rounded-md" 
                      />
                      <div className="absolute bottom-1 right-1 bg-black/70 text-white px-1 py-0.5 text-xs rounded">
                        {formatDuration(relatedVideo.duration)}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium line-clamp-2 text-sm">{relatedVideo.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{relatedVideo.author.name}</p>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
                        <span>{formatNumber(relatedVideo.views)} просмотров</span>
                        <span>•</span>
                        <span>{formatDate(relatedVideo.uploadedAt)}</span>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VideoPage;
