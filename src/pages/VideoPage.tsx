import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ThumbsUp, ThumbsDown, MessageSquare, User, Share2, Flag, Clock, Tag, Eye } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/use-toast";

interface Comment {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  likes: number;
  dislikes: number;
  timestamp: Date;
  replies: Reply[];
}

interface Reply {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  likes: number;
  dislikes: number;
  timestamp: Date;
}

interface VideoData {
  id: string;
  title: string;
  description: string;
  videoUrl?: string;
  thumbnail?: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    subscribers: number;
  };
  views: number;
  likes: number;
  dislikes: number;
  uploadedAt: Date;
  duration: number;
  tags: string[];
  comments: Comment[];
  allowComments?: boolean;
  isNsfw?: boolean;
  isNsfl?: boolean;
}

const VideoPage = () => {
  const { videoId } = useParams();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasDisliked, setHasDisliked] = useState(false);
  const [video, setVideo] = useState<VideoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  
  useEffect(() => {
    // Имитация загрузки данных с сервера
    const fetchVideoData = async () => {
      setLoading(true);
      try {
        // Проверяем, есть ли видео в localStorage
        const uploadedVideos = JSON.parse(localStorage.getItem('uploadedVideos') || '[]');
        let foundVideo = uploadedVideos.find((v: any) => v.id === videoId);
        
        // Если видео не найдено в localStorage и это demo-video, используем заготовку
        if (!foundVideo && videoId === "demo-video") {
          // Получаем текущую дату и время
          const now = new Date();
          // Создаем дату загрузки видео (например, 3 дня назад)
          const uploadDate = new Date(now);
          uploadDate.setDate(now.getDate() - 3);
          
          // Случайные значения для просмотров, лайков и дизлайков
          const views = Math.floor(Math.random() * 100000) + 1000;
          const likes = Math.floor(Math.random() * 10000) + 100;
          const dislikes = Math.floor(Math.random() * 1000) + 10;
          
          foundVideo = {
            id: "demo-video",
            title: "Introduction to AnnonTube - The Anonymous Video Platform",
            description: "Welcome to AnnonTube! This is a platform where you can share and watch videos anonymously. Learn about features like video uploads, comments, likes/dislikes, and more in this introduction video.",
            thumbnail: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
            author: {
              id: "anontube-official",
              name: "AnnonTube Official",
              avatar: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=100&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
              subscribers: 5243
            },
            views: views,
            likes: likes,
            dislikes: dislikes,
            uploadedAt: uploadDate,
            duration: 425, // 7:05
            tags: ["tutorial", "introduction", "anontube"],
            comments: [
              {
                id: "comment1",
                author: {
                  name: "Anonymous User",
                  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
                },
                content: "Great platform idea! Looking forward to using it.",
                likes: 24,
                dislikes: 2,
                timestamp: new Date(uploadDate.getTime() + 3600000), // 1 hour after upload
                replies: [
                  {
                    id: "reply1",
                    author: {
                      name: "AnnonTube Official",
                      avatar: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=100&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
                    },
                    content: "Thanks for your support! We're working hard to make this the best anonymous video platform.",
                    likes: 12,
                    dislikes: 0,
                    timestamp: new Date(uploadDate.getTime() + 7200000) // 2 hours after upload
                  }
                ]
              }
            ],
            allowComments: true
          };
        }
        
        if (!foundVideo) {
          throw new Error("Video not found");
        }
        
        // Получаем URL видео из localStorage
        const videoSrc = localStorage.getItem(`video_${videoId}`);
        setVideoUrl(videoSrc);
        
        // Преобразуем дату, если она строка
        if (typeof foundVideo.uploadedAt === 'string') {
          foundVideo.uploadedAt = new Date(foundVideo.uploadedAt);
        }
        
        // Преобразуем даты комментариев, если они строки
        if (foundVideo.comments) {
          foundVideo.comments = foundVideo.comments.map((comment: any) => {
            if (typeof comment.timestamp === 'string') {
              comment.timestamp = new Date(comment.timestamp);
            }
            
            if (comment.replies) {
              comment.replies = comment.replies.map((reply: any) => {
                if (typeof reply.timestamp === 'string') {
                  reply.timestamp = new Date(reply.timestamp);
                }
                return reply;
              });
            }
            
            return comment;
          });
        }
        
        // Увеличиваем счетчик просмотров
        foundVideo.views = (foundVideo.views || 0) + 1;
        
        // Обновляем видео в localStorage
        if (videoId !== "demo-video") {
          const updatedVideos = uploadedVideos.map((v: any) => 
            v.id === videoId ? { ...v, views: foundVideo.views } : v
          );
          localStorage.setItem('uploadedVideos', JSON.stringify(updatedVideos));
        }
        
        setVideo(foundVideo);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    
    fetchVideoData();
  }, [videoId]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Загрузка видео...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !video) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold mb-4">Видео не найдено</h1>
          <p className="mb-6 text-muted-foreground">Видео, которое вы ищете, не существует или было удалено.</p>
          <Button asChild><Link to="/">Вернуться на главную</Link></Button>
        </div>
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
    if (!video) return;
    
    let newLikes = video.likes;
    let newDislikes = video.dislikes;
    
    if (hasLiked) {
      newLikes -= 1;
    } else {
      newLikes += 1;
      if (hasDisliked) {
        newDislikes -= 1;
        setHasDisliked(false);
      }
    }
    
    setHasLiked(!hasLiked);
    setVideo({ ...video, likes: newLikes, dislikes: newDislikes });
    
    // В реальном приложении здесь был бы запрос к API
    if (videoId !== "demo-video") {
      // Обновляем данные в localStorage
      const uploadedVideos = JSON.parse(localStorage.getItem('uploadedVideos') || '[]');
      const updatedVideos = uploadedVideos.map((v: any) => 
        v.id === videoId ? { ...v, likes: newLikes, dislikes: newDislikes } : v
      );
      localStorage.setItem('uploadedVideos', JSON.stringify(updatedVideos));
    }
  };
  
  const handleDislike = () => {
    if (!video) return;
    
    let newLikes = video.likes;
    let newDislikes = video.dislikes;
    
    if (hasDisliked) {
      newDislikes -= 1;
    } else {
      newDislikes += 1;
      if (hasLiked) {
        newLikes -= 1;
        setHasLiked(false);
      }
    }
    
    setHasDisliked(!hasDisliked);
    setVideo({ ...video, likes: newLikes, dislikes: newDislikes });
    
    // В реальном приложении здесь был бы запрос к API
    if (videoId !== "demo-video") {
      // Обновляем данные в localStorage
      const uploadedVideos = JSON.parse(localStorage.getItem('uploadedVideos') || '[]');
      const updatedVideos = uploadedVideos.map((v: any) => 
        v.id === videoId ? { ...v, likes: newLikes, dislikes: newDislikes } : v
      );
      localStorage.setItem('uploadedVideos', JSON.stringify(updatedVideos));
    }
  };
  
  const handleCommentSubmit = () => {
    if (!video || !newComment.trim()) return;
    
    const commentId = Date.now().toString(36);
    const commentAuthor = {
      name: "Анонимный пользователь",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    };
    
    const newCommentObj: Comment = {
      id: commentId,
      author: commentAuthor,
      content: newComment,
      likes: 0,
      dislikes: 0,
      timestamp: new Date(),
      replies: []
    };
    
    const updatedComments = [newCommentObj, ...video.comments];
    setVideo({ ...video, comments: updatedComments });
    setNewComment("");
    
    toast({
      title: "Комментарий добавлен",
      description: "Ваш комментарий успешно опубликован",
    });
    
    // В реальном приложении здесь был бы запрос к API
    if (videoId !== "demo-video") {
      // Обновляем данные в localStorage
      const uploadedVideos = JSON.parse(localStorage.getItem('uploadedVideos') || '[]');
      const updatedVideos = uploadedVideos.map((v: any) => 
        v.id === videoId ? { ...v, comments: updatedComments } : v
      );
      localStorage.setItem('uploadedVideos', JSON.stringify(updatedVideos));
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {/* Видеоплеер */}
            <div className="relative aspect-video bg-card rounded-lg overflow-hidden mb-4">
              {videoUrl ? (
                <video 
                  src={videoUrl} 
                  controls 
                  autoPlay
                  className="w-full h-full object-contain bg-black" 
                />
              ) : (
                <>
                  <img 
                    src={video.thumbnail} 
                    alt={video.title} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <p className="text-white">▶️ Видео недоступно</p>
                  </div>
                </>
              )}
              <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 text-sm rounded">
                {formatDuration(video.duration)}
              </div>
              {(video.isNsfw || video.isNsfl) && (
                <div className="absolute top-4 right-4 bg-red-600 text-white px-2 py-1 text-sm rounded">
                  {video.isNsfl ? "NSFL" : "NSFW"}
                </div>
              )}
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
                  <span>{formatNumber(video.likes)}</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`flex items-center space-x-1 ${hasDisliked ? "bg-red-100 border-red-300" : ""}`}
                  onClick={handleDislike}
                >
                  <ThumbsDown className={`h-4 w-4 ${hasDisliked ? "text-red-600" : ""}`} />
                  <span>{formatNumber(video.dislikes)}</span>
                </Button>
                <Button variant="outline" size="sm" className="flex items-center space-x-1">
                  <Share2 className="h-4 w-4" />
                  <span>Поделиться</span>
                </Button>
                <Button variant="outline" size="sm" className="flex items-center space-x-1">
                  <Flag className="h-4 w-4" />
                  <span>Жалоба</span>
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
                  {video.allowComments !== false && (
                    <div className="flex items-start space-x-4">
                      <Avatar>
                        <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" />
                        <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <textarea 
                          className="w-full border rounded-lg p-2 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-green-300"
                          placeholder="Добавьте комментарий..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                        />
                        <div className="flex justify-end mt-2">
                          <Button 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={handleCommentSubmit}
                            disabled={!newComment.trim()}
                          >
                            Отправить
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {video.allowComments === false && (
                    <div className="text-center py-4 border rounded-lg bg-muted/30">
                      <p className="text-muted-foreground">Комментарии отключены для этого видео</p>
                    </div>
                  )}
                  
                  {video.comments.length > 0 && <Separator />}
                  
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
                  
                  {video.allowComments !== false && video.comments.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Пока нет комментариев. Будьте первым!</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="related">
                <div className="grid grid-cols-1 gap-4">
                  <p className="text-muted-foreground">Похожие видео пока недоступны.</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Правая колонка с рекомендациями */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-medium mb-4">Рекомендованные видео</h3>
            <RecommendedVideos currentVideoId={videoId} />
          </div>
        </div>
      </main>
    </div>
  );
};

// Компонент для рекомендованных видео
const RecommendedVideos = ({ currentVideoId }: { currentVideoId?: string }) => {
  const [recommendedVideos, setRecommendedVideos] = useState<any[]>([]);
  
  useEffect(() => {
    // Получаем все загруженные видео из localStorage
    const uploadedVideos = JSON.parse(localStorage.getItem('uploadedVideos') || '[]');
    
    // Фильтруем, чтобы исключить текущее видео
    const filteredVideos = uploadedVideos.filter((video: any) => video.id !== currentVideoId);
    
    // Отображаем максимум 5 рекомендаций
    setRecommendedVideos(filteredVideos.slice(0, 5));
  }, [currentVideoId]);
  
  if (recommendedVideos.length === 0) {
    return (
      <p className="text-muted-foreground">Нет рекомендованных видео.</p>
    );
  }
  
  return (
    <div className="space-y-4">
      {recommendedVideos.map((video: any) => (
        <Link key={video.id} to={`/video/${video.id}`} className="flex space-x-2 group">
          <div className="relative w-32 h-20 bg-muted rounded overflow-hidden">
            {localStorage.getItem(`thumbnail_${video.id}`) ? (
              <img 
                src={localStorage.getItem(`thumbnail_${video.id}`) || ''} 
                alt={video.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white">
                <FileVideo className="h-6 w-6" />
              </div>
            )}
            <div className="absolute bottom-1 right-1 bg-black/70 text-white px-1 py-0.5 text-xs rounded">
              {Math.floor(video.duration / 60)}:{String(video.duration % 60).padStart(2, '0')}
            </div>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-medium line-clamp-2 group-hover:text-primary">{video.title}</h4>
            <p className="text-xs text-muted-foreground">{video.author.name}</p>
            <p className="text-xs text-muted-foreground">{formatNumber(video.views)} просмотров</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

// Вспомогательная функция для форматирования чисел
const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

export default VideoPage;
