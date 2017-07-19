from django.db import models
from . import api

# Create your models here.
class Market(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=500, null=True)
    address_street = models.CharField(max_length=500, null=True)
    address_city = models.CharField(max_length=500, null=True)
    address_state = models.CharField(max_length=50, null=True)
    address_zip = models.CharField(max_length=500, null=True)

    def __str__(self):
        return self.name

    def save(self):
        data = api.getMarketData(str(self.id))
        self.name = data['MarketName']
        self.address_street = data['street']
        self.address_city = data['city']
        self.address_state = data['State']
        self.address_zip = data['zip']
        self.website = data['Website']

    def mapsLink(self):
        """
        TODO
        """
        return "N/A"
