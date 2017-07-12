# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2017-07-11 05:09
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('markets', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='market',
            name='address_state',
            field=models.CharField(max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='market',
            name='address_city',
            field=models.CharField(max_length=500, null=True),
        ),
        migrations.AlterField(
            model_name='market',
            name='address_street',
            field=models.CharField(max_length=500, null=True),
        ),
        migrations.AlterField(
            model_name='market',
            name='address_zipcode',
            field=models.CharField(max_length=500, null=True),
        ),
    ]