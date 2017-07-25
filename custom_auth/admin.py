from django import forms
from django.contrib import admin
from django.contrib.auth.models import Group
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
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

    def clean_password2(self):
        # Check that the two password entries match.
        password1 = self.cleaned_data.get('password1')
        password2 = self.cleaned_data.get('password2')
        if password1 and password2 and password1 != password2:
            raise form.ValidationError("Passwords don't match")
        return password2

    def save(self, commit=True):
        # Save the provided password in hashed format
        user = super(UserCreationForm, self).save(commit=False)
        user.set_password(self.cleaned_data['password1'])
        if commit:
            user.save()
        return user


class UserChangeForm(models.ModelForm):
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


class UserAdmin(BaseUserAdmin):
    # The forms to add & change user instances
    form = UserChangeForm
    add_form = UserCreationForm

    # The fields to be used in displaying the User models
    list_display = ('email', 'first_name', 'last_name', 'is_admin',)
    list_filter = ('is_admin',)
    fieldsets = (
        (None, {'fields': ('email', 'password',)}),
        ('Personal info', {'fields': ('first_name', 'last_name',)}),
        ('Permissions', {'fields': ('is_admin')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'last_name', 'password1', 'password2')
        }),
    )
    search_fields = ('email', 'last_name', 'first_name',)
    ordering = ('email', 'last_name', 'first_name',)
    filter_horizontal = ()


# Register the UserAdmin...
admin.site.register(CustomUser, UserAdmin)
# Since we're not using Django's built-in permissions, unregister the Group
# model from admin.
admin.site.unregister(Group)
