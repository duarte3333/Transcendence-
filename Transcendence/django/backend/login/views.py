from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.decorators import login_required
from .forms import RegisterForm
from login.models import PongUser
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
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


    # if request.method == 'POST':
    #     form = AuthenticationForm(request, data=request.POST)
    #     if form.is_valid():
    #         username = form.cleaned_data.get('username')
    #         password = form.cleaned_data.get('password')
    #         user = authenticate(request, username=username, password=password)
    #         if user is not None:
    #             login(request, user)
    #             messages.info(request, f"You are now logged in as {username}.")
    #             return redirect('home')  # Redirect to a home page or another page
    #         else:
    #             messages.error(request, "Invalid username or password.")
    #     else:
    #         messages.error(request, "Invalid username or password.")
    # else:
    #     form = AuthenticationForm()
    # return render(request, 'index.html', {'form': form})

# def login_view(request):
#     if request.method == 'POST':
#         form = AuthenticationForm(request, data=request.POST)
#         if form.is_valid():
#             username = form.cleaned_data.get('username')
#             password = form.cleaned_data.get('password')
#             user = authenticate(request, username=username, password=password)
#             if user is not None:
#                 login(request, user)
#                 messages.info(request, f"You are now logged in as {username}.")
#                 return redirect('home')  # Redirect to a home page or another page
#             else:
#                 messages.error(request, "Invalid username or password.")
#         else:
#             messages.error(request, "Invalid username or password.")
#     else:
#         form = AuthenticationForm()
#     return render(request, 'index.html', {'form': form})


def logout_view(request):
    logout(request)
    messages.info(request, "You have successfully logged out.")
    return redirect('login')

@csrf_exempt
def register(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')
            display_name = data.get('displayName')
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

        if not username or not password or not display_name:
            return JsonResponse({'error': 'All fields are required.'}, status=400)

        if PongUser.objects.filter(username=username).exists():
            return JsonResponse({'error': 'Username already taken.'}, status=400)
        
        if PongUser.objects.filter(display_name=display_name).exists():
            return JsonResponse({'error': 'Display Name already taken.'}, status=400)

        # Create a new user
        user = PongUser.objects.create_user(username=username, password=password)
        user.display_name = display_name  # Use the display name as first name or as desired
        user.save()

        # Log the user in
        login(request, user)

        # Respond with success
        return JsonResponse({'success': True})
        # return render(request, 'index.html')
