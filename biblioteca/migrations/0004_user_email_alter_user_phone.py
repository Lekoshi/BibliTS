# Generated by Django 4.2.1 on 2023-05-10 01:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('biblioteca', '0003_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='email',
            field=models.CharField(default='Não informado', max_length=200),
        ),
        migrations.AlterField(
            model_name='user',
            name='phone',
            field=models.CharField(default='Não informado', max_length=200),
        ),
    ]
