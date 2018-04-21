from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

import urllib.parse

from custom_auth.models import CustomUser


products = ["baked_goods", "cheese", "crafts", "flowers", "eggs", "seafood",
            "herbs", "vegetables", "honey", "jams", "meat", "nursery", "nuts",
            "plants", "poultry", "prepared_food", "soap", "trees", "wine",
            "coffee", "beans", "fruits", "grains", "juices", "mushrooms",
            "petfood", "tofu", "wild_harvested", "organic", "credit", "wic",
            "wic_cash", "sfmnp", "snap"]

class Market(models.Model):
    """
    Model to house information about a single farmers market.
    """
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=500, null=True)
    address_street = models.CharField(max_length=500, null=True)
    address_city = models.CharField(max_length=500, null=True)
    address_county = models.CharField(max_length=500, null=True)
    address_state = models.CharField(max_length=50, null=True)
    address_zip = models.CharField(max_length=50, null=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True)

    # URLs
    website = models.CharField(max_length=2000, null=True)
    facebook = models.CharField(max_length=2000, null=True)
    twitter = models.CharField(max_length=2000, null=True)
    youtube = models.CharField(max_length=2000, null=True)
    other_media = models.CharField(max_length=2000, null=True)

    # Boolean fields
    has_baked_goods = models.NullBooleanField(null=True, default=None)
    has_cheese = models.NullBooleanField(null=True, default=None)
    has_crafts = models.NullBooleanField(null=True, default=None)
    has_flowers = models.NullBooleanField(null=True, default=None)
    has_eggs = models.NullBooleanField(null=True, default=None)
    has_seafood = models.NullBooleanField(null=True, default=None)
    has_herbs = models.NullBooleanField(null=True, default=None)
    has_vegetables = models.NullBooleanField(null=True, default=None)
    has_honey = models.NullBooleanField(null=True, default=None)
    has_jams = models.NullBooleanField(null=True, default=None)
    has_meat = models.NullBooleanField(null=True, default=None)
    has_nursery = models.NullBooleanField(null=True, default=None)
    has_nuts = models.NullBooleanField(null=True, default=None)
    has_plants = models.NullBooleanField(null=True, default=None)
    has_poultry = models.NullBooleanField(null=True, default=None)
    has_prepared_food = models.NullBooleanField(null=True, default=None)
    has_soap = models.NullBooleanField(null=True, default=None)
    has_trees = models.NullBooleanField(null=True, default=None)
    has_wine = models.NullBooleanField(null=True, default=None)
    has_coffee = models.NullBooleanField(null=True, default=None)
    has_beans = models.NullBooleanField(null=True, default=None)
    has_fruits = models.NullBooleanField(null=True, default=None)
    has_grains = models.NullBooleanField(null=True, default=None)
    has_juices = models.NullBooleanField(null=True, default=None)
    has_mushrooms = models.NullBooleanField(null=True, default=None)
    has_petfood = models.NullBooleanField(null=True, default=None)
    has_tofu = models.NullBooleanField(null=True, default=None)
    has_wild_harvested = models.NullBooleanField(null=True, default=None)
    has_organic = models.NullBooleanField(null=True, default=None)
    has_credit = models.NullBooleanField(null=True, default=None)
    has_wic = models.NullBooleanField(null=True, default=None)
    has_wic_cash = models.NullBooleanField(null=True, default=None)
    has_sfmnp = models.NullBooleanField(null=True, default=None)
    has_snap = models.NullBooleanField(null=True, default=None)

    def __str__(self):
        return self.name

    def maps_link(self):
        args = '{0},{1} ("{2}")'
        args = args.format(self.latitude, self.longitude, self.name)
        args = urllib.parse.quote(args, '()')
        url = 'https://maps.google.com/?q=' + args
        return url

    @property
    def product_count(self):
        return len([p for p in products if getattr(self, 'has_' + p)])



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
        if self.user:
            return self.user.first_name
        else:
            return 'Anonymous profile'


@receiver(post_save, sender=CustomUser)
def update_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
    instance.profile.save()


def get_or_create_profile(user, session):
    """
    Returns the profile associated with `user`, or, if the user isn't signed in,
    creates an anonymous profile and associates it with the session.
    """
    # For logged in users, return profile associated with them
    if user.is_authenticated:
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
