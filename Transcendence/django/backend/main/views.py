from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required


# from .forms import RegisterForm
# @login_required
def main_view(request):
    return (render(request, 'main_index.html'))
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
    # return (HttpResponse("test"))
# Create your views here.