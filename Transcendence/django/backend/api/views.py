import json
import os
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from .models import Game
import logging
from django.shortcuts import get_object_or_404
from django.contrib.auth.decorators import login_required
from login.models import PongUser
from django.core.exceptions import ValidationError
from django.views.decorators.http import require_POST
from django.contrib.auth.hashers import make_password
from django.core.files.images import get_image_dimensions
from django.core.files.storage import default_storage
from django.utils import timezone
from django.contrib.auth.password_validation import validate_password, ValidationError
from datetime import timedelta
from django.contrib.auth import authenticate, login, logout

logger = logging.getLogger(__name__)

# @csrf_exempt
@login_required
def create_game(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            game = Game().create(
                players = data.get('players', []),
                game_type = data.get('type'),
                playerHost = request.user.id,
                numberPlayers =  data.get('number_of_players')
            )
            data["id"] = game.id

            # Resposta de sucesso
            return JsonResponse({'success': True, 'game': data}, status=201)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
    return JsonResponse({'error': 'Invalid JSON'}, status=400)

# @csrf_exempt
@login_required
def match_game(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            result = Game().list(status = 'running', playerId=request.user.id, numberPlayers = int(data.get('number_of_players')))
            if (len(result) == 1):
                return JsonResponse({'success': True, 'game': result[0]}, status=201)
            result = Game().list(status = 'pending', numberPlayers = int(data.get('number_of_players')))
            logger.info(f'Match_game result: ${result}')
            if (len(result) == 0):
                game = Game().create(
                    players = data.get('players', [request.user.id]),
                    game_type = data.get('type'),
                    playerHost = request.user.id,
                    numberPlayers =  data.get('number_of_players'),
                    status = 'pending'
                )
                data["id"] = game.id
            else:
                return JsonResponse({'success': True, 'game': result[0]}, status=201)
            return JsonResponse({'success': True, 'game': data}, status=201)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

    return JsonResponse({'error': 'Invalid JSON'}, status=400)

# @csrf_exempt
@login_required
def list_game(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            data = []
        result = Game().list(status = data.get('status'), playerId = data.get('playerId'))
        return JsonResponse({'success': True, 'game': result}, status=201)

    return JsonResponse({'error': 'Invalid JSON'}, status=400)

def list_game_wins(player_id=None):
    if player_id:
        result = Game().list(status="finished", playerId=player_id)
        result = [game for game in result if game.get('winner') == str(player_id)]
        return len(result)
    return 0

def list_game_losses(player_id=None):
    if player_id:
        result = Game().list(status="finished", playerId=player_id)

        result = [
            game for game in result
            if (game.get('winner') != str(player_id) and game.get('winner') != 'disconnect') or
            any(entry['id'] == str(player_id) and entry['score'] == 'disconnect' for entry in game.get('scoreList', []))
        ]

        return len(result)

    return 0


# @csrf_exempt
@login_required
def update_game(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            dataID = data.get("id")
            
            if not dataID:
                return JsonResponse({'error': 'ID not provided'}, status=400)
            
            try:
                game = Game.objects.get(id=dataID)
            except Game.DoesNotExist:
                return JsonResponse({'error': 'Game not found'}, status=404)

            for field, value in data.items():
                if hasattr(game, field):
                    setattr(game, field, value)
                else:
                    return JsonResponse({'error': f'Field {field} does not exist on Game'}, status=400)

            
            # Save the changes
            game.save()
            return JsonResponse({'success': True, 'game': game.toJson()}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Exception as e:
            # Log the exception
            logger.error(f'Unexpected error: {e}')
            return JsonResponse({'error': 'An unexpected error occurred'}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=405)



# @csrf_exempt
@login_required
def deleted_game(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            game = Game.objects.get(id=data.get("id"))
            game.status = "deleted"
            game.save()
            return JsonResponse({'success': True, 'game': game.toJson()}, status=201)
        except json.JSONDecodeError:
            data = []
    return JsonResponse({'error': 'Invalid JSON'}, status=400)

# Helper function to validate file types
def validate_image(file):
    valid_extensions = ['jpeg', 'jpg', 'png']
    ext = file.name.split('.')[-1].lower()
    if ext not in valid_extensions:
        raise ValidationError('Invalid file type. Only JPEG and PNG are allowed.')

    # Optionally, you can also check if the file is a valid image
    try:
        width, height = get_image_dimensions(file)
        if width <= 0 or height <= 0:
            raise ValidationError('Uploaded file is not a valid image.')
    except Exception:
        raise ValidationError('Error processing the image file.')

@login_required
def user_profile(request):
    try:
        if not request.body:
            user = request.user
        else:
            try:
                data = json.loads(request.body)
                # logger.info(f'\n\n>>>> data == {data}\n\n')
                user = PongUser.objects.get(display_name=data['display_name'])
            except PongUser.DoesNotExist:
                return JsonResponse({'success': False, 'message': 'User does not exist.'}, status=404)
        user_data = {
            'id': user.id,
            'username': user.username,
            'display_name': user.display_name,
            'profile_picture': user.profile_picture.url if user.profile_picture else 'static/userImages/p1.png',
            'banner_picture': user.banner_picture.url if user.banner_picture else 'static/userImages/banner.jpeg',
            'up_key': user.up_key if user.up_key else 'w',
            'down_key': user.down_key if user.down_key else 's',
            'wins': list_game_wins(user.id),
            'losses': list_game_losses(user.id),
        }
        return JsonResponse({'success': True, 'user': user_data}, status=200)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

@login_required
def get_user_by_id(request):
    try:
        data = json.loads(request.body)
        # logger.info(f'\n\n>>>> data == {data}\n\n')
        try:
            user = PongUser.objects.get(id=data['id'])
        except PongUser.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'User does not exist.'}, status=404)
        user_data = {
            'id': user.id,
            'username': user.username,
            'display_name': user.display_name,
            'profile_picture': user.profile_picture.url if user.profile_picture else 'static/userImages/p1.png',
            'banner_picture': user.banner_picture.url if user.banner_picture else 'static/userImages/banner.jpeg',
            'up_key': user.up_key if user.up_key else 'w',
            'down_key': user.down_key if user.down_key else 's',
            'wins': list_game_wins(user.id),
            'losses': list_game_losses(user.id),
        }
        return JsonResponse({'success': True, 'user': user_data}, status=200)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

def update_user_properties(user: PongUser, updated_fields: dict):
    # List of allowed fields that can be updated
    allowed_fields = {
        'username',
        'display_name',
        'profile_picture',
        'banner_picture',
        'down_key',
        'up_key',
        'friends'
    }
    
    # Apply the updates and validation
    for field, value in updated_fields.items():
        if field not in allowed_fields:
            raise ValidationError(f"Field '{field}' is not allowed to be updated.")
        
        setattr(user, field, value)
    
    # Additional validation: down_key and up_key should not be the same
    if ('down_key' in updated_fields or 'up_key' in updated_fields) and user.down_key == user.up_key:
        raise ValidationError("The 'down_key' and 'up_key' cannot be the same.")

    # Validate the updated user instance
    # user.full_clean()  # This will raise a ValidationError if any fields are invalid
    
    # Save the updated user instance to the database
    user.save()

    return user

@login_required
@require_POST
def update_profile(request):
    try:
        user = request.user

        data = request.POST.dict()  # Form data (e.g., username, display_name)
        files = request.FILES        # Uploaded files (e.g., profile_picture, banner_picture)

        # Validate and handle profile picture update if it exists
        if 'profile_picture' in files:
            validate_image(files['profile_picture'])
            user.profile_picture = files['profile_picture']

        # Validate and handle banner picture update if it exists
        if 'banner_picture' in files:
            validate_image(files['banner_picture'])
            user.banner_picture = files['banner_picture']

        # Handle password change separately
        if 'password' in data:
            new_password = data.pop('password')
            if not new_password.strip():
                raise ValidationError('Password cannot be empty.')
            try:
                validate_password(new_password)
            except ValidationError as e:
                return JsonResponse({'error': e.messages}, status=400)
            user.set_password(new_password)

        # Validate non-empty fields
        for key, value in data.items():
            if not value.strip():
                raise ValidationError(f'{key.replace("_", " ").title()} cannot be empty.')
            setattr(user, key, value)

        # Update other fields using the helper function
        updated_user = update_user_properties(user, data)

        # Save the user after all updates are applied
        user.save()
        if user is not None:
            login(request, user)

        return JsonResponse({'status': 'success', 'message': 'Profile updated successfully.', 'user': updated_user.to_dict()})

    except ValidationError as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

    except Exception as e:
        logger.exception("Unexpected error occurred")
        return JsonResponse({'status': 'error', 'message': 'An error occurred. ' + str(e)}, status=500)



def serialize_pong_user(user):
    user_dict = {
        'id': user.id,
        'username': user.username,
        'display_name': user.display_name,
        'profile_picture': user.profile_picture.url if user.profile_picture else None,
        'status': user.status,
    }
    return user_dict

# @csrf_exempt
@login_required
def list_users(request):
    try:
        result = PongUser.objects.all()
        pong_users_list = [serialize_pong_user(user) for user in result]
        return JsonResponse({'success': True, 'users':  pong_users_list},  safe=False, status=201)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)



# Define the threshold for considering a user "online"
ONLINE_THRESHOLD = timedelta(minutes=5)

@login_required
def user_friends(request):
    user = request.user
    friend_ids = user.friends
    # logger.info(f'firends ids = {friend_ids}')

    # Fetch friends by their IDs, getting their display names and last_seen timestamps
    friends = PongUser.objects.filter(id__in=friend_ids).values('id', 'display_name', 'last_seen')

    now = timezone.now()
    friends_data = []

    for friend in friends:
        is_online = (now - friend['last_seen']) <= ONLINE_THRESHOLD if friend['last_seen'] else False
        friends_data.append({
            'display_name': friend['display_name'],
            'online': is_online,
            'id': friend['id']
        })

    user_data = {
        'friends': friends_data
    }
    return JsonResponse({'success': True, 'user': user_data}, status=200)

@login_required
def add_friend(request):
    user = request.user
    friend_display_name = request.POST.get('friend_display_name')

    if not friend_display_name:
        return JsonResponse({'success': False, 'message': 'Friend display name not provided.'}, status=400)
    
    try:
        friend_user = PongUser.objects.get(display_name=friend_display_name)
    except PongUser.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'User does not exist.'}, status=404)
    
    if friend_user.id in user.friends:
        return JsonResponse({'success': False, 'message': 'User is already a friend.'}, status=400)
    
    user.friends.append(friend_user.id)
    user.save()

    if user.id not in friend_user.friends:
        friend_user.friends.append(user.id)
        friend_user.save()
    
    return JsonResponse({'success': True, 'message': 'Friend added successfully.'}, status=200)
