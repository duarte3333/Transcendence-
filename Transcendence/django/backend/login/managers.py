from django.contrib.auth.models import BaseUserManager

class PongUserManager(BaseUserManager):
    def create_superuser(self, username, email=None, password=None, **extra_fields):
        if password is None:
            raise TypeError('Superusers must have a password.')
        if not email:
            raise TypeError('Superusers must have an email address.')
        
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        # user.is_staff = True
        # user.is_superuser = True
        user.save(using=self._db)
        return user

    def create_user(self, username, email=None, password=None, **extra_fields):
        if not username:
            raise TypeError('Users must have a username.')
        if not email:
            raise TypeError('Users must have an email address.')

        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
