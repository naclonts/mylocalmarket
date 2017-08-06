from django.test import TestCase, RequestFactory
from .models import Market, Profile, get_or_create_profile
from custom_auth.models import CustomUser

# Create your tests here.
class MarketTestCase(TestCase):
    def setUp(self):
        Market.objects.create(name="Da Market!")

    def test_name(self):
        m = Market.objects.get(name="Da Market!")
        self.assertEqual(m.name, "Da Market!")

class AnonymousUserTest(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            email='tester@_', password='itsapassword567',
            first_name='te', last_name='st')

    def test_profile(self):
        session = self.client.session
        profile = get_or_create_profile(self.user, session)
        self.assertEqual(profile.user, self.user)
