# Generated by Django 4.2.7 on 2023-11-10 03:06

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_alter_simulationrequest_guid_realizationsstatuses_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='realizationsstatuses',
            name='last_update',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]