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
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE,
                                blank=True, null=True, unique=False)
    bio = models.TextField(max_length=1000, blank=True)
    location = models.CharField(max_length=50, blank=True)
    address_zip = models.CharField(max_length=50, blank=True)
    favorite_markets = models.ManyToManyField(Market)
    # Key to store session for anonymous users
    session_key = models.CharField(max_length=60, null=True, blank=True)

    def __str__(self):
        return self.user.first_name


@receiver(post_save, sender=CustomUser)
def update_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
    instance.profile.save()


def get_or_create_profile(user, session):
    """
    Returns the profile associated with `user`, or creates an anonymous profile
    if the user isn't signed in and stores it in the session.
    """
    # For logged in users, return profile associated with them
    if user.is_authenticated():
        return user.profile

    # Use session key to get anonymous profile
    if not session.session_key:
        session.save()
    session_key = session.session_key

    # Try to retrieve anonymous profile data
    if Profile.objects.filter(session_key=session_key).exists():
        return Profile.objects.get(session_key=session_key)

    # No profile and no session data yet -- make one!
    return Profile.objects.create(session_key=session_key)
