from django.shortcuts import render
from django import http
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.core.exceptions import ObjectDoesNotExist
from django.views.decorators.csrf import csrf_exempt
import json
from django.core.serializers import serialize

@csrf_exempt
def get_user(request):
    if request.method == "GET":
        users = User.objects.all()
        user_list = list(users.values('username'))
        return JsonResponse({'users':user_list}, status=200)
    if request.method == "POST":
        data = json.loads(request.body)
        username = data.get('username')
        try:
            user = User.objects.get(username=username) 
            user_data = {
                    'username': user.username,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name
            }
            return JsonResponse({"user": user_data}, status=200)
        except ObjectDoesNotExist:
            return JsonResponse({'error': 'User does not exist', 'username': username}, status=404)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)
    
        