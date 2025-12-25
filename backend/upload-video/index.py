import json
import os
import boto3
import base64
import uuid
from datetime import datetime
import psycopg2

def handler(event: dict, context) -> dict:
    '''Загрузка видео на сервер с проверкой капчи'''
    method = event.get('httpMethod', 'POST')

    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Captcha-Token'
            },
            'body': ''
        }

    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }

    try:
        body = json.loads(event.get('body', '{}'))
        
        captcha_verified = body.get('captchaVerified', False)
        if not captcha_verified:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Капча не пройдена'})
            }
        
        video_base64 = body.get('videoFile')
        thumbnail_base64 = body.get('thumbnailFile')
        title = body.get('title', '')
        description = body.get('description', '')
        author_name = body.get('authorName', 'Аноним')
        author_avatar = body.get('authorAvatar', '')
        video_type = body.get('videoType', 'regular')
        category = body.get('category', 'entertainment')
        is_nsfw = body.get('isNsfw', False)
        is_nsfl = body.get('isNsfl', False)
        show_in_newsfeed = body.get('showInNewsfeed', True)
        allow_comments = body.get('allowComments', True)
        video_format = body.get('videoFormat', 'hd')
        duration = body.get('duration', 0)
        
        if not video_base64 or not title:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Видео и название обязательны'})
            }
        
        s3 = boto3.client('s3',
            endpoint_url='https://bucket.poehali.dev',
            aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
            aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY']
        )
        
        video_id = str(uuid.uuid4())
        
        video_data = base64.b64decode(video_base64.split(',')[1] if ',' in video_base64 else video_base64)
        video_extension = 'mp4'
        video_key = f'videos/{video_id}.{video_extension}'
        
        s3.put_object(
            Bucket='files',
            Key=video_key,
            Body=video_data,
            ContentType='video/mp4'
        )
        
        video_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{video_key}"
        
        thumbnail_url = None
        if thumbnail_base64:
            thumbnail_data = base64.b64decode(thumbnail_base64.split(',')[1] if ',' in thumbnail_base64 else thumbnail_base64)
            thumbnail_key = f'thumbnails/{video_id}.jpg'
            
            s3.put_object(
                Bucket='files',
                Key=thumbnail_key,
                Body=thumbnail_data,
                ContentType='image/jpeg'
            )
            
            thumbnail_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{thumbnail_key}"
        
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor()
        
        cur.execute("""
            INSERT INTO videos (
                id, title, description, author_name, author_avatar,
                video_url, thumbnail_url, video_type, category, duration,
                is_nsfw, is_nsfl, show_in_newsfeed, allow_comments, video_format
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            video_id, title, description, author_name, author_avatar,
            video_url, thumbnail_url, video_type, category, duration,
            is_nsfw, is_nsfl, show_in_newsfeed, allow_comments, video_format
        ))
        
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True,
                'videoId': video_id,
                'videoUrl': video_url,
                'thumbnailUrl': thumbnail_url
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
