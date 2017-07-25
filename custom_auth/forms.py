from django import forms
from django.contrib.auth.forms import ReadOnlyPasswordHashField

from custom_auth.models import CustomUser

class UserCreationForm(forms.ModelForm):
    """A form for creating new users. Includes all the basic fields, as well as
    a repeated password."""
    password1 = forms.CharField(label='Password',
                                widget=forms.PasswordInput(attrs={'placeholder': 'Password'}))
    password2 = forms.CharField(label='Password confirmation',
                                widget=forms.PasswordInput(attrs={'placeholder': 'Repeat password'}))

    class Meta:
        model = CustomUser
        fields = ('email', 'first_name', 'last_name')

    def __init__(self, *args, **kwargs):
        # Set up widget attributes
        super(UserCreationForm, self).__init__(*args, **kwargs)
        self.fields['email'].widget.attrs = {'placeholder': 'Email address'}
        self.fields['first_name'].widget.attrs = {'placeholder': 'First name (optional)'}
        self.fields['last_name'].widget.attrs = {'placeholder': 'Last name (optional)'}

    def clean_password2(self):
        # Check that the two password entries match.
        password1 = self.cleaned_data.get('password1')
        password2 = self.cleaned_data.get('password2')
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("Passwords don't match")
        return password2

    def save(self, commit=True):
        # Save the provided password in hashed format
        user = super(UserCreationForm, self).save(commit=False)
        user.set_password(self.cleaned_data['password1'])
        if commit:
            user.save()
        return user


class UserChangeForm(forms.ModelForm):
    """A form for updating users. Includes all fields, except replaces the
    password field with admin's password hash display field."""
    password = ReadOnlyPasswordHashField()

    class Meta:
        model = CustomUser
        fields = ('email', 'password', 'first_name', 'last_name', 'is_active',
                  'is_admin',)

    def clean_password(self):
        # Regardless of what the user provides, return the initial value.
        # This is done here, rather than on the field, because the field doesn't
        # have access to the initial value.
        return self.initial['password']
