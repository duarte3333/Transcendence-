# accounts/forms.py

from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from login.models import PongUser

class RegisterForm(UserCreationForm):
    email = forms.EmailField(required=True)

    class Meta:
        model = PongUser
        fields = ['username', 'password', 'display_name']

    def clean_username(self):
        username = self.cleaned_data.get('username')
        if PongUser.objects.filter(username=username).exists():
            raise forms.ValidationError('Username already exists.')
        return username
