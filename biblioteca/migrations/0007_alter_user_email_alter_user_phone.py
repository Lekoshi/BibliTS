# Generated by Django 4.2.1 on 2023-05-10 07:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('biblioteca', '0006_rename_booktransaction_transaction'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='email',
            field=models.CharField(blank=True, default='Não informado', max_length=200),
        ),
        migrations.AlterField(
            model_name='user',
            name='phone',
            field=models.CharField(blank=True, default='Não informado', max_length=200),
        ),
    ]
