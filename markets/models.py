from django.db import models

# Create your models here.
class Market(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=500)
    address_street = models.CharField(max_length=500)
    address_city = models.CharField(max_length=500)
    address_zipcode = models.CharField(max_length=500)

    def __str__(self):
        return self.name
