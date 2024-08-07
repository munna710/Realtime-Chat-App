from django import forms
from django.contrib.auth.forms import AuthenticationForm

from .models import User


class LoginForm(AuthenticationForm):
    class Meta:
        model = User
        fields = ('username', 'password',)


class AddUserForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ('email', 'name', 'role', 'password',)
        widgets = {
            'email': forms.TextInput(attrs={
                'class': 'form-control bg-dark border border-light text-white'
            }),
            'name': forms.TextInput(attrs={
                'class': 'form-control bg-dark border border-light text-white'
            }),
            'role': forms.Select(attrs={
                'class': 'form-control bg-dark border border-light text-white'
            }),
            'password': forms.TextInput(attrs={
                'class': 'form-control bg-dark border border-light text-white'
            })
        }


class EditUserForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ('email', 'name', 'role',)
        widgets = {
            'email': forms.TextInput(attrs={
                'class': 'form-control bg-dark border border-light text-white'
            }),
            'name': forms.TextInput(attrs={
                'class': 'form-control bg-dark border border-light text-white'
            }),
            'role': forms.Select(attrs={
                'class': 'form-control bg-dark border border-light text-white'
            })
        }