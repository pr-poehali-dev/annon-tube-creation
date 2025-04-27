import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ThumbsUp, ThumbsDown, MessageSquare, User, Share2, Flag, Clock, Tag, Eye } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  videoUrl: string;
  thumbnail: string;
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
}

const VideoPage = () => {
  const { videoId } = useParams();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasDisliked, setHasDisliked] = useState(false);
  const [video, setVideo] = useState<VideoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Имитация загрузки данных с сервера
    const fetchVideoData = async () => {
      setLoading(true);
      try {
        // В реальном приложении здесь был бы запрос к API
        // fetch(`/api/videos/${videoId}`)
        
        // Для демонстрации используем имитацию запроса
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Проверка, существует ли видео
        if (videoId !== "demo-video") {
          throw new Error("Video not found");
        }
        
        // Получаем текущую дату и время
        const now = new Date();
        // Создаем дату загрузки видео (например, 3 дня назад)
        const uploadDate = new Date(now);
        uploadDate.setDate(now.getDate() - 3);
        
        // Случайные значения для просмотров, лайков и дизлайков
        const views = Math.floor(Math.random() * 100000) + 1000;
        const likes = Math.floor(Math.random() * 10000) + 100;
        const dislikes = Math.floor(Math.random() * 1000) + 10;
        
        const mockVideoData: VideoData = {
          id: "demo-video",
          title: "Introduction to AnnonTube - The Anonymous Video Platform",
          description: "Welcome to AnnonTube! This is a platform where you can share and watch videos anonymously. Learn about features like video uploads, comments, likes/dislikes, and more in this introduction video.",
          videoUrl: "https://example.com/demo-video.mp4",
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
          ]
        };
        
        setVideo(mockVideoData);
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
            <p className="text-muted-foreground">Loading video...</p>
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
          <h1 className="text-2xl font-bold mb-4">Video not found</h1>
          <p className="mb-6 text-muted-foreground">The video you're looking for doesn't exist or has been removed.</p>
          <Button asChild><Link to="/">Back to Home</Link></Button>
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
                <p className="text-white">▶️ Video Player Placeholder</p>
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
                    <p className="text-sm text-muted-foreground">{formatNumber(video.author.subscribers)} subscribers</p>
                  </div>
                </Link>
                <Button 
                  variant={isSubscribed ? "default" : "outline"} 
                  className={isSubscribed ? "bg-green-600 hover:bg-green-700" : ""} 
                  onClick={() => setIsSubscribed(!isSubscribed)}
                >
                  {isSubscribed ? "Subscribed" : "Subscribe"}
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
                  <span>Share</span>
                </Button>
                <Button variant="outline" size="sm" className="flex items-center space-x-1">
                  <Flag className="h-4 w-4" />
                  <span>Report</span>
                </Button>
              </div>
            </div>
            
            {/* Детали видео */}
            <div className="bg-card p-4 rounded-lg mb-6">
              <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                <span className="flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>{formatNumber(video.views)} views</span>
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
                  Comments ({video.comments.length})
                </TabsTrigger>
                <TabsTrigger value="related">
                  Related Videos
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
                        placeholder="Add a comment..."
                      />
                      <div className="flex justify-end mt-2">
                        <Button className="bg-green-600 hover:bg-green-700">Send</Button>
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
                              <span>Reply</span>
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
                  <p className="text-muted-foreground">Related videos will appear here.</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Правая колонка с рекомендациями */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-medium mb-4">Recommended Videos</h3>
            <div className="space-y-4">
              <p className="text-muted-foreground">No recommendations available right now.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VideoPage;
