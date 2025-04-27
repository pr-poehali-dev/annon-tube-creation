import { Link } from "react-router-dom";
import { ThumbsUp, ThumbsDown, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface VideoCardProps {
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

const VideoCard = ({
  id,
  title,
  thumbnail,
  author,
  views,
  likes,
  dislikes,
  uploadedAt,
  duration,
  isNsfw,
  isNsfl,
}: VideoCardProps) => {
  // Format duration (seconds to MM:SS or HH:MM:SS)
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Format view count (1000 -> 1K, 1000000 -> 1M)
  const formatViews = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-md border border-border bg-card hover:shadow-md transition-shadow">
      <Link to={`/video/${id}`} className="relative aspect-video overflow-hidden">
        <img 
          src={thumbnail} 
          alt={title} 
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute bottom-2 right-2 bg-black/70 text-white px-1 py-0.5 text-xs rounded">
          {formatDuration(duration)}
        </div>
        {(isNsfw || isNsfl) && (
          <div className="absolute top-2 right-2 bg-destructive/90 text-destructive-foreground px-2 py-0.5 text-xs font-bold rounded">
            {isNsfl ? "NSFL" : "NSFW"}
          </div>
        )}
      </Link>
      <div className="p-3">
        <Link to={`/video/${id}`} className="font-medium line-clamp-2 mb-1 hover:text-primary">
          {title}
        </Link>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Link to={`/channel/${author.name}`} className="flex items-center gap-1.5 hover:text-foreground">
              <img src={author.avatar} alt={author.name} className="w-6 h-6 rounded-full" />
              <span>{author.name}</span>
            </Link>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {formatViews(views)}
            </span>
            <span className="flex items-center gap-1">
              <ThumbsUp className="h-3 w-3" />
              {formatViews(likes)}
            </span>
            <span className="flex items-center gap-1">
              <ThumbsDown className="h-3 w-3" />
              {formatViews(dislikes)}
            </span>
          </div>
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          {formatDistanceToNow(uploadedAt, { addSuffix: true })}
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
