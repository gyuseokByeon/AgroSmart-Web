# Generated by Django 3.0.1 on 2020-03-07 02:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0012_auto_20200307_0150'),
    ]

    operations = [
        migrations.AddField(
            model_name='artifact',
            name='name',
            field=models.CharField(default='dummy', max_length=256),
            preserve_default=False,
        ),
    ]
