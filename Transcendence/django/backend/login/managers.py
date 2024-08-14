from django.contrib.auth.models import BaseUserManager

class PongUserManager(BaseUserManager):
    def create_superuser(self, username, password=None, **extra_fields):
        if password is None:
            raise TypeError('Superusers must have a password.')
        user = self.model(username=username, **extra_fields)
        user.set_password(password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user

    def create_user(self, username, password=None, **extra_fields):

        user = self.model(username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
