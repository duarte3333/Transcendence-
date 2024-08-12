from django.shortcuts import render
from django.contrib.auth.decorators import login_required

@login_required
def pong(request):
    return render(request, 'pong_index.html')

def game(request):
    return render(request, 'pong_home.html')

def navbar(request):
    return render (request, 'pong_navbar.html')

def settings(request):
    return render(request, 'pong_profileSettings.html')

def profile(request):
    return render(request, 'pong_profile.html')

def tournamentLocal(request):
    return render(request, 'pong_game.html')

def tournamentOnline(request):
    return render(request, 'pong_onlineTournament.html')