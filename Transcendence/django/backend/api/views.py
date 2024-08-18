import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from .models import Game
import logging

from django.contrib.auth.decorators import login_required

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
    user = request.user 
    user_data = {
        'id': user.id,
        'username': user.username,
        'display_name': user.ponguser.display_name if hasattr(user, 'ponguser') else None,
        'profile_picture': user.ponguser.profile_picture.url if hasattr(user, 'ponguser') and user.ponguser.profile_picture else None,
        'banner_picture': user.ponguser.banner_picture.url if hasattr(user, 'ponguser') and user.ponguser.banner_picture else None,
    }
    
    return JsonResponse({'success': True, 'user': user_data}, status=200)
