# """backend URL Configuration

# The `urlpatterns` list routes URLs to views. For more information please see:
#     https://docs.djangoproject.com/en/3.2/topics/http/urls/
# Examples:
# Function views
#     1. Add an import:  from my_app import views
#     2. Add a URL to urlpatterns:  path('', views.home, name='home')
# Class-based views
#     1. Add an import:  from other_app.views import Home
#     2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
# Including another URLconf
#     1. Import the include() function: from django.urls import include, path
#     2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
# """

# from login.views import login_view, logout_view, register, user_info
# from main.views import main_view
# from pong.views import home, pong, navbar, settings, profile, tournamentLocal
# from django.contrib import admin
# from django.urls import path, re_path
# from django.shortcuts import redirect

# urlpatterns = [
#     path('admin/', admin.site.urls),
#     path('api/user-info/', user_info, name='user-info'),
#     path('', login_view, name='login'),
#     path('logout/', logout_view, name='logout'),
#     path('home/', home, name='home'),
#     path('pong/index', pong, name='pong'),

#     path('api/home/', home),
#     # path('api/', login_view),
#     path('api/logout/', logout_view),
#     path('api/pong/index', pong),
#     path('api/register/', register),
#     path('api/navbar/', navbar),
#     path('navbar/api/navbar/', navbar),
#     # path('api/api/settings/', settingssettings/'),
#     path('api/settings/', settings),
#     path('api/profile/', profile),
#     re_path(r'^.*$', main_view),  # Captura todas as URLs
#     # re_path(r'^(?!api/).*$', main_view),  # Capture all URLs except those starting with 'api/'
#     path('tournament/local/', tournamentLocal, name='tournamentLocal'),
#     # path('navbar/', navbar, name='navbar'),
#     path('api/register/', register, name='register'),
#     path('api/login/', login_view, name='login'),
#     path('api/settings/', settings, name='api/settings/'),
# ]



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

from login.views import login_view, logout_view, register, user_info
from main.views import main_view
from pong.views import home, navbar, settings, profile, tournamentLocal, footer
from django.contrib import admin
from django.urls import path, re_path
from api.views import create_game , list_game, update_game, deleted_game, user_profile, match_game


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/user-info/', user_info, name='user-info'),
    path('', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('home/', home, name='home'),
    path('tournament/local/', tournamentLocal, name='tournamentLocal'),
    path('api/register/', register, name='register'),
    path('api/login/', login_view, name='login'),
    path('api/footer/', footer, name='footer'),
    path('api/settings/', settings, name='api/settings/'),
    path('settings/', settings, name='settings'),
    path('profile/', profile, name='profile'),
    path('api/game/create', create_game),
    path('api/game/list', list_game),
    path('api/game/update', update_game),
    path('api/game/deleted', deleted_game),
    path('api/game/match', match_game),
    path('game', tournamentLocal, name='mygame'),

    # USER
    path('api/user/profile', user_profile),
    
    # RUBENS
    path('api/home/', home),
    path('api/logout/', logout_view),
    path('api/register/', register),
    path('api/navbar/', navbar),
    path('api/settings/', settings),
    path('api/tournament/local/', tournamentLocal),
    path('api/profile/', profile),
    re_path(r'^.*$', main_view),  # Captura todas as URLs
]