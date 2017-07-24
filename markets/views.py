from django.core.serializers import serialize
from django.forms.models import model_to_dict
from django.http import HttpResponseRedirect
from django.shortcuts import render, get_object_or_404
from django.views.generic.base import TemplateView
import pyzipcode

from .forms import SearchForm
from .models import Market

def search_page(request, zip='80526'):
    """
    Initial page.
    """
    # If this is a POST from the search bar, redirect to new zip search
    if request.method == 'POST':
        form = SearchForm(request.POST)
        if form.is_valid():
            return HttpResponseRedirect('/search//' + str(zip))

    # if this is just a GET, return page
    return render(
        request,
        'markets/index.html',
        {'search_query': zip},
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

    data = serialize('json', Market.objects.filter(id=market_id))
    return render(request, template, {'market': market, 'market_json': data})


def markets_within_zip(request, zip):
    """
    Return HTML containing markets within 20 miles of zip.
    """
    zip_db = pyzipcode.ZipCodeDatabase()
    zip_codes = [z.zip for z in zip_db.get_zipcodes_around_radius(zip, 20)]

    markets = Market.objects.filter(address_zip__in=zip_codes)
    data = serialize('json', markets)
    template = 'markets/multiple_summaries.html'
    return render(request, template, {'markets': markets, 'market_json': data})
