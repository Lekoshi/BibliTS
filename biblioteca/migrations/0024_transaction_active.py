# Generated by Django 4.2.1 on 2023-05-21 13:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('biblioteca', '0023_remove_transaction_active'),
    ]

    operations = [
        migrations.AddField(
            model_name='transaction',
            name='active',
            field=models.BooleanField(default=True),
        ),
    ]
