from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.decorators import login_required
from .forms import RegisterForm
from login.models import PongUser
from chat.models import Chat
from django.http import JsonResponse
from django.contrib.auth.password_validation import validate_password, ValidationError
import json
import logging


logger = logging.getLogger(__name__)

def login_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

        if not username or not password:
            return JsonResponse({'error': 'All fields are required.'}, status=400)

        # Authenticate the user
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({'success': True})
        else:
            return JsonResponse({'error': 'Invalid credentials'}, status=400)
    else:
        return render(request, 'index.html')

@login_required
def logout_view(request):
    logout(request)
    messages.info(request, "You have successfully logged out.")
    return redirect('login')

def register(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')
            display_name = data.get('displayName')
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        if ' ' in username:
            return JsonResponse({'error': 'Username cant have spaces.'}, status=400)
        if ' ' in display_name:
            return JsonResponse({'error': 'Display name cant have spaces.'}, status=400)
        if not username or not password or not display_name:
            return JsonResponse({'error': 'All fields are required.'}, status=400)

        if PongUser.objects.filter(username=username).exists():
            return JsonResponse({'error': 'Username already taken.'}, status=400)

        if PongUser.objects.filter(display_name=display_name).exists():
            return JsonResponse({'error': 'Display Name already taken.'}, status=400)

        # Validate password strength
        if username == password:
            return JsonResponse({'error': 'Password can not be equal to username.'}, status=400)
        try:
            validate_password(password)
        except ValidationError as e:
            return JsonResponse({'error': e.messages}, status=400)

        # Create a new user
        user = PongUser.objects.create_user(username=username, display_name=display_name, password=password)
        
        # user.display_name = display_name  # Use the display name as desired
        user.save()

        # Adiciona o novo usuário ao chat "geral"
        # Chat.add_user_to_general_chat(pong_user=user)        

        # Log the user in
        login(request, user)

        # Respond with success
        return JsonResponse({'success': True})

@login_required
def user_info(request):
    user = request.user
    data = {
        'username': user.username,
        'display_name': user.display_name,
        'profile_picture': user.profile_picture.url if user.profile_picture else None,
        'banner_picture': user.banner_picture.url if user.banner_picture else None,
        'down_key': user.down_key if user.banner_picture else None,
        'up_key': user.up_key if user.banner_picture else None,
    }
    return JsonResponse(data)

def index(request):
    return render(request, 'index.html')
