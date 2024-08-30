from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
import json
from .models import Chat

# @csrf_exempt
@login_required
def create_chat(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            chat = Chat.objects.create(
                user=data.get('user', []),
                name=data.get('name', ""),
                status=data.get('status', 'pending'),
                mensagens=data.get('mensagens', []),
            )
            data['id'] = chat.id
            return JsonResponse({'success': True, 'chat': data}, status=201)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Invalid method'}, status=400)

# @csrf_exempt
@login_required
def list_chats(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            if not isinstance(data, dict):
                return JsonResponse({'error': 'Invalid JSON format. Expected a dictionary.'}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        
        result = Chat().list(status=data.get('status'), user_id=data.get('userId'), name=data.get('name'))
        return JsonResponse({'success': True, 'chat': result}, status=201)
    return JsonResponse({'error': 'Invalid JSON'}, status=400)

# @csrf_exempt
@login_required
def update_chat(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            chat = Chat.objects.get(id=data.get("id"))

            for field, value in data.items():
                if hasattr(chat, field):
                    setattr(chat, field, value)
                else:
                    return JsonResponse({'error': f'Field {field} does not exist on chat'}, status=400)
            # Salvar as alterações
            chat.save()
            return JsonResponse({'success': True, 'chat': chat.toJson()}, status=201)
        except json.JSONDecodeError:
            data = []
    return JsonResponse({'error': 'Invalid JSON'}, status=400)

# @csrf_exempt
@login_required
def deleted_chat(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            chat = Chat.objects.get(id=data.get("id"))
            chat.status = "deleted"
            chat.save()
            return JsonResponse({'success': True, 'chat': chat.toJson()}, status=201)
        except json.JSONDecodeError:
            data = []
    return JsonResponse({'error': 'Invalid JSON'}, status=400)
