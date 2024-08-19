import json
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

logger = logging.getLogger(__name__)

@login_required
@csrf_exempt
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


@login_required
@csrf_exempt
def match_game(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            result = Game().list(status = 'running', playerId=request.user.id)
            if (len(result) == 1):
                return JsonResponse({'success': True, 'game': result[0]}, status=201)
            result = Game().list(status = 'pending')
            logger.info(f'Match_game result: ${result}')
            if (len(result) == 0):
                game = Game().create(
                    players = data.get('players', []),
                    game_type = data.get('type'),
                    playerHost = request.user.id,
                    numberPlayers =  data.get('number_of_players')
                )
                data["id"] = game.id
            else:
                return JsonResponse({'success': True, 'game': result[0]}, status=201)
            return JsonResponse({'success': True, 'game': data}, status=201)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

    return JsonResponse({'error': 'Invalid JSON'}, status=400)



@login_required
@csrf_exempt
def list_game(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            data = []
        result = Game().list(status = data.get('status'), playerId = data.get('playerId'))
        return JsonResponse({'success': True, 'game': result}, status=201)

    return JsonResponse({'error': 'Invalid JSON'}, status=400)

@login_required
@csrf_exempt
def update_game(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            game = Game.objects.get(id=data.get("id"))

            for field, value in data.items():
                if hasattr(game, field):
                    setattr(game, field, value)
                else:
                    return JsonResponse({'error': f'Field {field} does not exist on Game'}, status=400)
            # Salvar as alterações
            game.save()
            return JsonResponse({'success': True, 'game': game.toJson()}, status=201)
        except json.JSONDecodeError:
            data = []
    return JsonResponse({'error': 'Invalid JSON'}, status=400)


@login_required
@csrf_exempt
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

@login_required
def user_profile(request):
    try:
        user = request.user
        user_data = {
            'id': user.id,
            'username': user.username,
            'display_name': user.display_name,
            'profile_picture': user.profile_picture.url if user.profile_picture else None,
            'banner_picture': user.banner_picture.url if user.banner_picture else None,
            'up_key': user.up_key if user.up_key else 'w',
            'down_key': user.down_key if user.down_key else 's',
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
    
    for field, value in updated_fields.items():
        if field not in allowed_fields:
            raise ValidationError(f"Field '{field}' is not allowed to be updated.")
        
        setattr(user, field, value)
    
    # Validate the updated user instance
    # user.full_clean()  # This will raise a ValidationError if any fields are invalid
    
    # Save the updated user instance to the database
    user.save()

    return user

# @csrf_exempt
@login_required
@require_POST
def update_profile(request):
    try:
        data = json.loads(request.body)
        user = request.user
        
        # Handle password change separately
        if 'password' in data:
            new_password = data.pop('password')
            user.password = make_password(new_password)  # Hash the new password
            user.save()

        # Update other fields using the helper function
        updated_user = update_user_properties(user, data)


        
        return JsonResponse({'status': 'success', 'message': 'Profile updated successfully.', 'user': updated_user.to_dict()})

    except ValidationError as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

    except Exception as e:
        return JsonResponse({'status': 'error', 'message': 'An error occurred. ' + str(e)}, status=500)



@login_required
def user_friends(request):
    user = request.user
    friend_ids = user.friends
    
    friends_display_names = PongUser.objects.filter(username__in=friend_ids).values_list('display_name', flat=True)

    user_data = {
        'friends': list(friends_display_names)
    }
    return JsonResponse({'success': True, 'user': user_data}, status=200)

@login_required
def add_friend(request):
    user = request.user
    friend_username = request.POST.get('friend_username')

    if not friend_username:
        return JsonResponse({'success': False, 'message': 'Friend username not provided.'}, status=400)
    
    try:
        friend_user = PongUser.objects.get(username=friend_username)
    except PongUser.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'User does not exist.'}, status=404)
    
    if friend_username in user.friends:
        return JsonResponse({'success': False, 'message': 'User is already a friend.'}, status=400)
    
    user.friends.append(friend_username)
    user.save()

    if user.username not in friend_user.friends:
        friend_user.friends.append(user.username)
        friend_user.save()
    
    return JsonResponse({'success': True, 'message': 'Friend added successfully.'}, status=200)