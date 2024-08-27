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

from login.views import login_view, logout_view, register, user_info, index
from main.views import main_view
from pong.views import home, navbar, settings, profile, namesForm, footer, game, chat
from django.contrib import admin
from django.urls import path, re_path
from chat.views import create_chat, list_chats, update_chat, deleted_chat
from api.views import create_game , list_game, update_game, deleted_game, user_profile, list_users, match_game, add_friend, user_friends, update_profile, get_user_by_id
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('admin', admin.site.urls),
    # API
    #   Game
    path('api/game/create', create_game),
    path('api/game/list', list_game),
    path('api/game/update', update_game),
    path('api/game/deleted', deleted_game),
    path('api/game/match', match_game),

    #CHAT
    path('api/chat/create', create_chat),
    path('api/chat/list', list_chats),
    path('api/chat/update', update_chat),
    path('api/chat/deleted', deleted_chat),

    #   USER
    path('api/user/profile', user_profile),
    path('api/user/get', get_user_by_id),
    path('api/user/profile/update', update_profile),
    path('api/user/addFriend', add_friend),
    path('api/user/userFriends', user_friends),
    path('api/user-info', user_info, name='user-info'),
    path('api/login', login_view, name='login'),
    path('api/logout', auth_views.LogoutView.as_view(), name='logout'),
    path('api/register', register),
    path('api/user/list', list_users),
    
    # END API
    # RUBENS
    # path('', index, name='index'),
    path('spa/', index, name='index'),
    path('spa/game', game, name='mygame'),
    path('spa/home', home),
    path('spa/logout', logout_view),
    path('spa/login', index, name='index'),
    path('spa/namesForm', namesForm),
    path('spa/footer', footer, name='footer'),
    path('spa/navbar', navbar),
    path('spa/chat', chat),
    path('spa/settings', settings),
    path('spa/profile', profile),
    re_path(r'^.*$', main_view),  # Captura todas as URLs
]

#------------------------------------------------------------------------------------------------

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
# from pong.views import home, navbar, settings, profile, tournamentLocal, footer
# from django.contrib import admin
# from django.urls import path, re_path
# from api.views import create_game , list_game, update_game, deleted_game, user_profile, match_game


# urlpatterns = [
#     path('admin/', admin.site.urls),
  
#     path('', login_view, name='login'),
#     path('logout/', logout_view, name='logout'),
#     path('home/', home, name='home'),
#     path('tournament/local/', tournamentLocal, name='tournamentLocal'),
#     path('register/', register, name='register'),
 
#     path('footer/', footer, name='footer'),
#     path('settings/', settings, name='api/settings/'),
#     path('settings/', settings, name='settings'),
#     path('profile/', profile, name='profile'),
#     path('game/', tournamentLocal, name='mygame'),

#     # API
#     #   Game
#     path('api/game/create', create_game),
#     path('api/game/list', list_game),
#     path('api/game/update', update_game),
#     path('api/game/deleted', deleted_game),
#     path('api/game/match', match_game),


#     #   USER
#     path('api/user/profile', user_profile),
#     path('api/user-info/', user_info, name='user-info'),   
#     path('api/login/', login_view, name='login'),
    
#     # END API
#     # RUBENS
#     path('home/', home),
#     path('logout/', logout_view),
#     path('register/', register),
#     path('navbar/', navbar),
#     path('settings/', settings),
#     path('tournament/local/', tournamentLocal),
#     path('profile/', profile),
#     re_path(r'^.*$', main_view),  # Captura todas as URLs
# ]
