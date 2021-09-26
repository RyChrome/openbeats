from django.contrib.auth.models import AbstractUser


class CustomUser(AbstractUser):
    pass

'''
AbstractUser model comes with these fields built in:

username (required)
password (required)
first_name
last_name
email
user_permissions
is_staff
is_active
is_superuser
last_login
date_joined
'''