# Generated by Django 4.2.1 on 2023-05-11 00:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('biblioteca', '0012_book_created_at'),
    ]

    operations = [
        migrations.RenameField(
            model_name='transaction',
            old_name='borrower',
            new_name='user',
        ),
        migrations.AlterField(
            model_name='transaction',
            name='due_date',
            field=models.DateField(),
        ),
    ]