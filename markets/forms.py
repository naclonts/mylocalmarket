from django import forms
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.utils.translation import ugettext as _

import custom_auth.models
from custom_auth.models import CustomUser
from custom_auth.forms import UserCreationForm

class SearchForm(forms.Form):
    search_value = forms.CharField(max_length=400)


class SignUpForm(UserCreationForm):
    # first_name = forms.CharField(max_length=30, required=False, help_text='Optional.',
    #                              widget=forms.TextInput(attrs={'placeholder': 'First name (optional)'}))
    # last_name = forms.CharField(max_length=30, required=False, help_text='Optional.',
    #                             widget=forms.TextInput(attrs={'placeholder': 'Last name (optional)'}))
    # # Store email address as username
    # username = forms.CharField(
    #     help_text=_('Valid email address is required.'),
    #     error_messages={
    #         'unique': _("A user with that email address already exists."),
    #     },
    #     widget=forms.TextInput(attrs={'placeholder': 'Email address'})
    # )

    class Meta:
        model = CustomUser
        fields = ('email', 'first_name', 'last_name', 'password1', 'password2')
    #
    # def __init__(self, *args, **kwargs):
    #     """
    #     Set up labels for password fields.
    #     """
    #     super(SignUpForm, self).__init__(*args, **kwargs)
    #     self.fields['password1'].widget.attrs = {'placeholder': 'Password'}
    #     self.fields['password2'].widget.attrs = {'placeholder': 'Confirm password'}
