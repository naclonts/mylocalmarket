# Django imports
from django import templates
from django.contrib.auth import login, authenticate
from django.core.serializers import serialize
from django.forms.models import model_to_dict
from django.http import HttpResponseRedirect
from django.shortcuts import render, redirect, get_object_or_404
from django.views.generic.base import TemplateView

# Nearby ZIP code lookups
from pyzipcode import ZipCodeDatabase

from .forms import SearchForm, SignUpForm
from .models import Market

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
        'markets/index.html',
        context={'search_value': zip},
    )


def market_detail(request, market_id):
    """
    Detailed view of a single market.
    """
    market = get_object_or_404(Market, id=market_id)

    if request.is_ajax():
        template = 'markets/detail_data.html'
    else:
        template = 'markets/detail.html'

    user_favorite = request.user.profile.favorite_markets.filter(id=market_id).exists()
    data = serialize('json', Market.objects.filter(id=market_id))
    context = {
        'market': market,
        'market_json': data,
        'user_favorite': True
    }
    return render(request, template, context=context)


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
