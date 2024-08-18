from django.shortcuts import render
from django.contrib.auth.decorators import login_required

def home(request):
    return render(request, 'pong_home.html')

def navbar(request):
    return render (request, 'pong_navbar.html')

def settings(request):
    return render(request, 'pong_profileSettings.html')

def profile(request):
    return render(request, 'pong_profile.html')

def tournamentLocal(request):
    return render(request, 'pong_tournament.html')

def game(request):
    return render(request, 'pong_game.html')

def footer(request):
    return render(request, 'pong_footer.html')