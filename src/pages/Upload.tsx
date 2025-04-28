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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload as UploadIcon, X, FileVideo, ImagePlus, TimerIcon, Clock } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
  const [videoType, setVideoType] = useState<"regular" | "shorts">("regular");
  const [category, setCategory] = useState<string>("entertainment");
  const [showInNewsfeed, setShowInNewsfeed] = useState(true);
  const [allowComments, setAllowComments] = useState(true);
  const [videoFormat, setVideoFormat] = useState<string>("hd");
  
  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Проверка формата видео для Shorts
      if (videoType === "shorts") {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
          // Если видео длиннее 2 минут, предупредить, но все равно загрузить
          if (video.duration > 120) {
            toast({
              title: "Предупреждение",
              description: "Shorts должны быть короче 2 минут. Ваше видео будет обрезано.",
              variant: "destructive"
            });
          }
          URL.revokeObjectURL(video.src);
        };
        video.src = URL.createObjectURL(file);
      }
      
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
      
      // Убираем автоматический запуск загрузки при выборе видео
      // Теперь загрузка начнется только при нажатии кнопки "Загрузить видео"
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

  const simulateUpload = (isShort: boolean = false) => {
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
          
          // Генерируем ID видео в зависимости от типа
          const newVideoId = isShort ? "shorts-demo" : "demo-video";
          
          // Перенаправить на страницу видео или шортс
          setTimeout(() => {
            if (isShort) {
              navigate(`/shorts/${newVideoId}`);
            } else {
              navigate(`/video/${newVideoId}`);
            }
          }, 500);
          return 100;
        }
        return prev + Math.floor(Math.random() * 20); // Ускоренный прогресс
      });
    }, 150); // Очень быстрая симуляция
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Проверка на наличие видеофайла перед началом загрузки
    if (!videoFile) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, выберите видеофайл для загрузки",
        variant: "destructive"
      });
      return;
    }
    
    // Проверка на наличие заголовка
    if (!title.trim()) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, введите название видео",
        variant: "destructive"
      });
      return;
    }
    
    // Начинаем загрузку только после нажатия кнопки
    simulateUpload(videoType === "shorts");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-6 max-w-3xl">
        <h1 className="text-2xl font-bold mb-6">Загрузка видео</h1>
        
        <Tabs defaultValue="regular" onValueChange={(value) => setVideoType(value as "regular" | "shorts")}>
          <TabsList className="w-full mb-6">
            <TabsTrigger value="regular" className="flex-1">Обычное видео</TabsTrigger>
            <TabsTrigger value="shorts" className="flex-1">Shorts (вертикальное короткое)</TabsTrigger>
          </TabsList>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <TabsContent value="regular" className="space-y-6">
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
                      required
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
            </TabsContent>
            
            <TabsContent value="shorts" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="shorts-title">Название шортс</Label>
                    <Input
                      id="shorts-title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Краткое название (до 50 символов)"
                      maxLength={50}
                      className="mt-1"
                      disabled={uploading}
                      required
                    />
                    <div className="text-xs text-muted-foreground mt-1">
                      {title.length}/50 символов
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="shorts-description">Описание</Label>
                    <Textarea
                      id="shorts-description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Краткое описание (необязательно)"
                      className="min-h-20 mt-1"
                      disabled={uploading}
                    />
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="shorts-nsfw"
                      checked={isNsfw}
                      onCheckedChange={(checked) => setIsNsfw(checked === true)}
                      disabled={uploading}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label htmlFor="shorts-nsfw" className="text-sm font-medium leading-none">
                        NSFW (18+)
                      </Label>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label className="block mb-2">Вертикальное видео (до 2 мин)</Label>
                    <div className="border-2 border-dashed rounded-lg p-4 text-center">
                      {videoPreview ? (
                        <div className="relative">
                          <video 
                            src={videoPreview} 
                            controls 
                            className="mx-auto h-60 rounded"
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
                          <div className="absolute bottom-2 right-2 bg-black/70 text-white px-1 py-0.5 text-xs rounded flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>Макс. 2 мин</span>
                          </div>
                        </div>
                      ) : (
                        <div 
                          className="flex flex-col items-center justify-center py-12 cursor-pointer"
                          onClick={() => videoInputRef.current?.click()}
                        >
                          <FileVideo className="h-10 w-10 text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Нажмите чтобы выбрать вертикальное видео
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Рекомендуемый формат: 9:16, до 2 минут
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
                </div>
              </div>
            </TabsContent>
            
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-3">Дополнительные настройки</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="category">Категория</Label>
                    <select
                      id="category"
                      className="w-full p-2 rounded-md border mt-1"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      disabled={uploading}
                    >
                      <option value="entertainment">Развлечения</option>
                      <option value="education">Образование</option>
                      <option value="music">Музыка</option>
                      <option value="gaming">Игры</option>
                      <option value="technology">Технологии</option>
                      <option value="news">Новости</option>
                      <option value="sports">Спорт</option>
                      <option value="other">Другое</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label className="block mb-2">Качество видео</Label>
                    <RadioGroup 
                      defaultValue={videoFormat} 
                      onValueChange={setVideoFormat}
                      className="space-y-1"
                      disabled={uploading}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="hd" id="hd" />
                        <Label htmlFor="hd">HD (1080p)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="sd" id="sd" />
                        <Label htmlFor="sd">SD (480p) - быстрее загрузка</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="auto" id="auto" />
                        <Label htmlFor="auto">Автоматически (адаптивно)</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="show-newsfeed"
                      checked={showInNewsfeed}
                      onCheckedChange={(checked) => setShowInNewsfeed(checked === true)}
                      disabled={uploading}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label htmlFor="show-newsfeed" className="text-sm font-medium leading-none">
                        Показывать в ленте
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Если отключено, видео будет доступно только по прямой ссылке
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="allow-comments"
                      checked={allowComments}
                      onCheckedChange={(checked) => setAllowComments(checked === true)}
                      disabled={uploading}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label htmlFor="allow-comments" className="text-sm font-medium leading-none">
                        Разрешить комментарии
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Если отключено, зрители не смогут оставлять комментарии
                      </p>
                    </div>
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
                disabled={uploading || !videoFile}
              >
                <UploadIcon className="h-4 w-4 mr-2" />
                {uploading ? "Загрузка..." : "Загрузить видео"}
              </Button>
            </div>
          </form>
        </Tabs>
      </main>
    </div>
  );
};

export default Upload;
