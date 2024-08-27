from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import PongUser

class PongUserAdmin(UserAdmin):
    model = PongUser

    # Fields to display when viewing or editing a user
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('display_name', 'profile_picture', 'banner_picture', 'friends')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Custom Controls', {'fields': ('up_key', 'down_key')}),
    )

    # Fields to display when adding a new user
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'password1', 'password2', 'display_name'),
        }),
    )

    # Fields to display in the user list page
    list_display = ('username', 'display_name', 'is_staff', 'friends', 'id')

    # Fields to filter by in the user list page
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'friends')

    # Fields to search by in the user list page
    search_fields = ('username', 'display_name', 'friends')

admin.site.register(PongUser, PongUserAdmin)
