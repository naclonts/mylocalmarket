from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

import urllib.parse

from custom_auth.models import CustomUser


class Market(models.Model):
    """
    Model to house information about a single farmers market.
    """
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=500, null=True)
    website = models.CharField(max_length=2000, null=True)
    address_street = models.CharField(max_length=500, null=True)
    address_city = models.CharField(max_length=500, null=True)
    address_county = models.CharField(max_length=500, null=True)
    address_state = models.CharField(max_length=50, null=True)
    address_zip = models.CharField(max_length=50, null=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True)

    def __str__(self):
        return self.name

    def maps_link(self):
        args = '{0},{1} ("{2}")'
        args = args.format(self.latitude, self.longitude, self.name)
        args = urllib.parse.quote(args, '()')
        url = 'https://maps.google.com/?q=' + args
        return url


class Profile(models.Model):
    """
    User-related information. In a one-to-one field relationship
    with CustomUser, but is used to extend with additional attributes.
    """
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    bio = models.TextField(max_length=1000, blank=True)
    location = models.CharField(max_length=50, blank=True)
    address_zip = models.CharField(max_length=50, blank=True)
    favorite_markets = models.ManyToManyField(Market)
    # Key to store session for anonymous users
    session_key = models.CharField(max_length=60, blank=True)

    def __str__(self):
        return self.user.first_name


@receiver(post_save, sender=CustomUser)
def update_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
    instance.profile.save()
