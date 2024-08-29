from django.shortcuts import render
from django.contrib.auth.decorators import login_required

# @login_required
def home(request):
    return render(request, 'pong_home.html')

# @login_required
def navbar(request):
    return render (request, 'pong_navbar.html')

# @login_required
def chat(request):
    return render (request, 'pong_chat.html')

# @login_required
def settings(request):
    return render(request, 'pong_profileSettings.html')

# @login_required
def profile(request):
    return render(request, 'pong_profile.html')

# @login_required
def namesForm(request):
    return render(request, 'pong_namesForm.html')

# @login_required
def game(request):
    return render(request, 'pong_game.html')

# @login_required
def footer(request):
    return render(request, 'pong_footer.html')