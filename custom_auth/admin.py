from django.contrib import admin
from django.contrib.auth.models import Group
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from custom_auth.models import CustomUser
from custom_auth.forms import (
    UserChangeForm, UserCreationForm,
)

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
        ('Permissions', {'fields': ('is_admin',)}),
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
