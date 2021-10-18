# Generated by Django 3.2.7 on 2021-10-18 22:32

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('spotify', '0002_auto_20211018_2124'),
    ]

    operations = [
        migrations.AlterField(
            model_name='spotifytoken',
            name='user',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]
