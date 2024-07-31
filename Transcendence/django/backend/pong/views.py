from django.shortcuts import render

def pong(request):
    return render(request, 'pong_index.html')

def game(request):
    return render(request, 'pong_home.html')