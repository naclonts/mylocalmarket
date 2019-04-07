# Django imports
from django.contrib.auth import login, authenticate
from django.core.serializers import serialize
from django.forms.models import model_to_dict
from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.generic.base import TemplateView
import json

# Nearby ZIP code lookups
from pyzipcode import ZipCodeDatabase

from custom_auth.models import CustomUser

from .forms import SearchForm, SignUpForm
from .models import Market, Profile, get_or_create_profile


def landing_page(request):
    return render(
        request,
        'markets/landing_page.html',
    )


def search_page(request, zip='80526'):
    """
    Initial page.
    """
    # If this is a POST from the search bar, set zip to search value
    if request.method == 'POST':
        form = SearchForm(request.POST)
        if form.is_valid():
            zip = form.cleaned_data['search_value']
        else:
            print(form.errors)

    #if this is just a GET, return page
    return render(
        request,
        'markets/search.html',
        context={'search_value': zip},
    )


def market_detail(request, market_id):
    """
    Detailed view of a single market.
    """
    market = get_object_or_404(Market, id=market_id)
    profile = get_or_create_profile(request.user, request.session)

    if request.is_ajax():
        template = 'markets/detail_data.html'
    else:
        template = 'markets/detail.html'

    user_favorite = profile.favorite_markets.filter(id=market_id).exists()
    data = serialize('json', Market.objects.filter(id=market_id))
    context = {
        'market': market,
        'market_json': data,
        'user_favorite': True
    }
    return render(request, template, context=context)

@ensure_csrf_cookie
def markets_within_zip(request, zip):
    """
    Return HTML containing markets within 20 miles of zip.
    """
    zip_db = ZipCodeDatabase()
    zip_codes = [z.zip for z in zip_db.get_zipcodes_around_radius(zip, 20)]

    markets = Market.objects.filter(address_zip__in=zip_codes)
    data = serialize('json', markets)
    template = 'markets/multiple_summaries.html'
    return render(request, template, {'markets': markets, 'market_json': data})

def zip_coords(request, zipcode):
    """
    Returns latitude and longitude of given zipcode.
    """
    zip_db = ZipCodeDatabase()
    zip_data = zip_db[zipcode]
    coords = dict(lat=zip_data.latitude, lon=zip_data.longitude)
    return HttpResponse(json.dumps(coords), status=200)

def signup(request):
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            form.save()
            email = form.cleaned_data.get('email')
            raw_password = form.cleaned_data.get('password1')
            user = authenticate(username=email, password=raw_password)
            login(request, user)
            return redirect('markets:search_page')
    else:
        form = SignUpForm()
    return render(request, 'signup.html', {'form': form})


@ensure_csrf_cookie
def toggle_favorite(request, market_id):
    """
    Set a farmers market to be one of the user's favorites, or remove if already
    a favorite.
    """
    if request.method == 'POST':
        market = get_object_or_404(Market, id=market_id)
        profile = get_or_create_profile(request.user, request.session)
        favorites = profile.favorite_markets

        # If it's currently a favorite, remove it
        if favorites.filter(id=market_id).exists():
            favorites.remove(market)
            response_text = 'Market removed from favorites.'
        # Not a favorite: add it
        else:
            favorites.add(market)
            response_text = 'Market added to favorites.'

        return HttpResponse(response_text, status=200)

def favorites_list(request):
    """
    Returns a page with user's favorited markets.
    """
    profile = get_or_create_profile(request.user, request.session)
    favorites = profile.favorite_markets.all()
    context = {'markets': favorites}
    template = 'markets/favorites_list.html'
    return render(request, template, context)
