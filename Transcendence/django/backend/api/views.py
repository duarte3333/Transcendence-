import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from .models import Game
from django.contrib.auth.decorators import login_required

@login_required
@csrf_exempt
def create_game(request):
    if request.method == 'POST':
        return JsonResponse({'success': True, 'game': json.loads(request.body)}, status=201)
        try:
            # Parse do JSON recebido
            data = json.loads(request.body)
            players = data.get('players', [])
            game_type = data.get('type')
            number_of_players = data.get('number_of_players')

            # Validação básica dos parâmetros
            if not players or not game_type or not number_of_players:
                return JsonResponse({'error': 'Missing parameters'}, status=400)

            # Verifique se o número de jogadores é consistente com a lista de IDs
            if len(players) != number_of_players:
                return JsonResponse({'error': 'Number of players does not match the list of player IDs'}, status=400)

            # Criação do objeto Game
            game = Game.create(
                players=players,
                type=game_type,
                playerHost=request.user.id,
                number_of_players=number_of_players
            )

            # Resposta de sucesso
            return JsonResponse({'success': True, 'game': game}, status=201)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

    return JsonResponse({'error': 'Invalid method'}, status=405)
