import json
import os
import psycopg2

def handler(event: dict, context) -> dict:
    '''Получение списка видео из базы данных'''
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }

    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }

    try:
        query_params = event.get('queryStringParameters') or {}
        category = query_params.get('category', 'all')
        video_type = query_params.get('type', 'regular')
        limit = int(query_params.get('limit', 50))
        offset = int(query_params.get('offset', 0))
        
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor()
        
        base_query = """
            SELECT id, title, description, author_name, author_avatar,
                   video_url, thumbnail_url, video_type, category, duration,
                   views, likes, dislikes, is_nsfw, is_nsfl,
                   show_in_newsfeed, allow_comments, video_format, uploaded_at
            FROM videos
            WHERE video_type = %s AND show_in_newsfeed = true
        """
        
        params = [video_type]
        
        if category != 'all':
            base_query += " AND category = %s"
            params.append(category)
        
        base_query += " ORDER BY uploaded_at DESC LIMIT %s OFFSET %s"
        params.extend([limit, offset])
        
        cur.execute(base_query, params)
        
        rows = cur.fetchall()
        
        videos = []
        for row in rows:
            videos.append({
                'id': row[0],
                'title': row[1],
                'description': row[2],
                'author': {
                    'name': row[3],
                    'avatar': row[4] or 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
                },
                'videoUrl': row[5],
                'thumbnail': row[6] or 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
                'videoType': row[7],
                'category': row[8],
                'duration': row[9],
                'views': row[10],
                'likes': row[11],
                'dislikes': row[12],
                'isNsfw': row[13],
                'isNsfl': row[14],
                'showInNewsfeed': row[15],
                'allowComments': row[16],
                'videoFormat': row[17],
                'uploadedAt': row[18].isoformat() if row[18] else None
            })
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'videos': videos,
                'count': len(videos)
            })
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': f'Ошибка сервера: {str(e)}'})
        }
