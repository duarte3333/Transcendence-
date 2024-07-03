from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import User
import json

def login_page(request):
    return render(request, 'index.html')

@csrf_exempt
def login(request) -> JsonResponse:
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')

            return check_login(username, password)
        except Exception as e:
            return JsonResponse({'message': str(e)}, status=400)
    return JsonResponse({'message': 'Invalid request'}, status=405)

def check_login(username:str, password:str) -> JsonResponse:
    try:
        user = User.objects.get(name=username)
        if user.Password == password:
            return JsonResponse({'message': 'Login successful'}, status=200)
        else:
            return JsonResponse({'message': 'Invalid password'}, status=400)
    except:
        return JsonResponse({'message': 'User not found'}, status=404)
    
def register_page(request):
    return render(request, 'register.html')

@csrf_exempt
def register(request) -> JsonResponse:
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')

            if User.objects.filter(name=username).exists():
                return JsonResponse({'message': 'Username already exists'}, status=400)

            user = User(name=username, Password=password)
            user.save()
            return JsonResponse({'message': 'User created successfully'}, status=201)
                
        except Exception as e:
            return JsonResponse({'message': str(e)}, status=400)

    return JsonResponse({'message': 'Invalid request method'}, status=405)