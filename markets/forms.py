from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User


class SearchForm(forms.Form):
    search_value = forms.CharField(max_length=400)


class SignUpForm(UserCreationForm):
    first_name = forms.CharField(max_length=30, required=False, help_text='Optional.')
    last_name = forms.CharField(max_length=30, required=False, help_text='Optional.')
    zip_code = forms.CharField(max_length=5, required=False, help_text='Optional.')
    email = forms.EmailField(max_length=254, help_text='Valid email address required.')

    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'email', 'zip_code',
                  'password1', 'password2')
                  
