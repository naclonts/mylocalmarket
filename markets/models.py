from django.db import models
import urllib.parse

# Create your models here.
class Market(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=500, null=True)
    website = models.CharField(max_length=2000, null=True)
    address_street = models.CharField(max_length=500, null=True)
    address_city = models.CharField(max_length=500, null=True)
    address_county = models.CharField(max_length=500, null=True)
    address_state = models.CharField(max_length=50, null=True)
    address_zip = models.CharField(max_length=500, null=True)
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
