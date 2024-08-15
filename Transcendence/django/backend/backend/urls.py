"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
# from django.contrib import admin
# from login.views import login, login_page, register, register_page
# from pong.views import pong, game
# from django.urls import path, re_path
# from django.shortcuts import redirect

# urlpatterns = [
#     path('admin/', admin.site.urls),
#     path('register/', register_page),
#     # path('', login_page, name="carla"),
#     path('pong/', pong),
#     path('game/', game),
#     re_path(r'^.*$', login_page),  # Captura todas as URLs
#     # path('*', login_page),
#     # path('register/', register_page),

#     # path('api/login/', login),
#     # path('api/register/', register),
# ]

from login.views import login_view, logout_view, register, user_info
from main.views import main_view
from pong.views import home, game, pong, navbar, settings, profile, tournamentLocal
from django.contrib import admin
from django.urls import path, re_path
from django.shortcuts import redirect

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/user-info/', user_info, name='user-info'),
    path('', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('home/', home, name='home'),
    path('pong/index', pong, name='pong'),

    path('api/home/', game),
    path('api/', login_view),
    path('api/logout/', logout_view),
    path('api/pong/index', pong),
    path('api/register/', register),
    path('api/navbar/', navbar),
    path('navbar/api/navbar/', navbar),
    # path('api/api/settings/', settingssettings/'),
    path('api/settings/', settings),
    path('api/profile/', profile),
    re_path(r'^.*$', main_view)  # Captura todas as URLs
    # re_path(r'^(?!api/).*$', main_view),  # Capture all URLs except those starting with 'api/'
    path('tournament/local/', tournamentLocal, name='tournamentLocal'),
    # path('navbar/', navbar, name='navbar'),
    path('api/register/', register, name='register'),
    path('api/login/', login_view, name='login'),
    path('api/settings/', settings, name='api/settings/'),
]
