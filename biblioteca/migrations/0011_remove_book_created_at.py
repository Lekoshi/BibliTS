# Generated by Django 4.2.1 on 2023-05-10 22:58

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('biblioteca', '0010_rename_createsd_at_book_created_at'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='book',
            name='created_at',
        ),
    ]