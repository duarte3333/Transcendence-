from django.contrib.auth.models import BaseUserManager

class PongUserManager(BaseUserManager):
    def create_superuser(self, username, email, password=None, **extra_fields):
        if password is None:
            raise TypeError('Superusers must have a password.')
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user

    def create_user(self, username, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
