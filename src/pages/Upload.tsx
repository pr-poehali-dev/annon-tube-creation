import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";
import { Upload as UploadIcon, X, FileVideo, ImagePlus } from "lucide-react";

const Upload = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isNsfw, setIsNsfw] = useState(false);
  const [isNsfl, setIsNsfl] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  
  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
      
      // Автоматически запускаем загрузку при выборе видео
      simulateUpload();
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const url = URL.createObjectURL(file);
      setThumbnailPreview(url);
    }
  };

  const clearVideo = () => {
    if (videoPreview) URL.revokeObjectURL(videoPreview);
    setVideoFile(null);
    setVideoPreview(null);
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  const clearThumbnail = () => {
    if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
    setThumbnailFile(null);
    setThumbnailPreview(null);
    if (thumbnailInputRef.current) thumbnailInputRef.current.value = "";
  };

  const simulateUpload = () => {
    setUploading(true);
    setProgress(0);
    
    // Ускоренная симуляция загрузки
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          
          // Показать уведомление об успешной загрузке
          toast({
            title: "Видео успешно загружено",
            description: "Ваше видео уже доступно для просмотра",
          });
          
          // Перенаправить на страницу видео (имитация ID нового видео)
          const newVideoId = "demo-video";
          setTimeout(() => navigate(`/video/${newVideoId}`), 500);
          return 100;
        }
        return prev + Math.floor(Math.random() * 20); // Ускоренный прогресс
      });
    }, 150); // Очень быстрая симуляция
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    simulateUpload();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-6 max-w-3xl">
        <h1 className="text-2xl font-bold mb-6">Загрузка видео</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Название видео</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Введите название видео"
                  maxLength={100}
                  className="mt-1"
                  disabled={uploading}
                />
                <div className="text-xs text-muted-foreground mt-1">
                  {title.length}/100 символов
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Опишите ваше видео (необязательно)"
                  className="min-h-32 mt-1"
                  disabled={uploading}
                />
              </div>
              
              <div className="space-y-3">
                <Label>Возрастные ограничения</Label>
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="nsfw"
                    checked={isNsfw}
                    onCheckedChange={(checked) => setIsNsfw(checked === true)}
                    disabled={uploading}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="nsfw" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      NSFW (материалы для взрослых)
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Отметьте, если видео содержит контент 18+
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="nsfl"
                    checked={isNsfl}
                    onCheckedChange={(checked) => setIsNsfl(checked === true)}
                    disabled={uploading}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="nsfl" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      NSFL (шокирующий контент)
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Отметьте, если видео содержит шокирующие материалы
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label className="block mb-2">Видеофайл</Label>
                <div className="border-2 border-dashed rounded-lg p-4 text-center">
                  {videoPreview ? (
                    <div className="relative">
                      <video 
                        src={videoPreview} 
                        controls 
                        className="mx-auto max-h-40 rounded"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={clearVideo}
                        disabled={uploading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div 
                      className="flex flex-col items-center justify-center py-4 cursor-pointer"
                      onClick={() => videoInputRef.current?.click()}
                    >
                      <FileVideo className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Нажмите чтобы выбрать видеофайл
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        MP4, WebM или MOV до 2 ГБ
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={videoInputRef}
                    className="hidden"
                    accept="video/mp4,video/webm,video/quicktime"
                    onChange={handleVideoChange}
                    disabled={uploading}
                  />
                </div>
              </div>
              
              <div>
                <Label className="block mb-2">Миниатюра (превью)</Label>
                <div className="border-2 border-dashed rounded-lg p-4 text-center">
                  {thumbnailPreview ? (
                    <div className="relative">
                      <img 
                        src={thumbnailPreview} 
                        alt="Превью видео" 
                        className="mx-auto max-h-40 rounded object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={clearThumbnail}
                        disabled={uploading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div 
                      className="flex flex-col items-center justify-center py-4 cursor-pointer"
                      onClick={() => thumbnailInputRef.current?.click()}
                    >
                      <ImagePlus className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Нажмите чтобы выбрать изображение
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        JPG, PNG или GIF (16:9 рекомендуется)
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={thumbnailInputRef}
                    className="hidden"
                    accept="image/jpeg,image/png,image/gif"
                    onChange={handleThumbnailChange}
                    disabled={uploading}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Загрузка видео...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
          
          <Separator />
          
          <div className="flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => navigate("/")}
              disabled={uploading}
            >
              Отмена
            </Button>
            <Button 
              type="submit" 
              className="bg-green-600 hover:bg-green-700"
              disabled={uploading}
            >
              <UploadIcon className="h-4 w-4 mr-2" />
              {uploading ? "Загрузка..." : "Загрузить видео"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Upload;
