from django import forms
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.utils.translation import ugettext as _

import custom_auth.models
from custom_auth.models import CustomUser
from custom_auth.forms import UserCreationForm


class SearchForm(forms.Form):
    search_value = forms.CharField(max_length=400)


class SignUpForm(UserCreationForm):
    class Meta:
        model = CustomUser
        fields = ('email', 'first_name', 'last_name', 'password1', 'password2')
