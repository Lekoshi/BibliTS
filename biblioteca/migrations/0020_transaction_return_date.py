# Generated by Django 4.2.1 on 2023-05-21 00:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('biblioteca', '0019_transaction_active'),
    ]

    operations = [
        migrations.AddField(
            model_name='transaction',
            name='return_date',
            field=models.DateField(null=True),
        ),
    ]