from django.shortcuts import render
from django.contrib.auth.decorators import login_required

@login_required
def pong(request):
    return render(request, 'pong_index.html')

def game(request):
    return render(request, 'pong_home.html')