from django.test import TestCase
from .models import Market

# Create your tests here.
class MarketTestCase(TestCase):
    def setUp(self):
        Market.objects.create(name="Da Market!")

    def test_name(self):
        m = Market.objects.get(name="Da Market!")
        self.assertEqual(m.name, "Da Market!")
