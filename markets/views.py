from django.forms.models import model_to_dict
from django.shortcuts import render, get_object_or_404

from . import api
from .models import Market

def index(request):
    """
    index
    """
    return render(
        request,
        'index.html',
        context={'hello_message': 'hello, world!'}
    )

def market_detail(request, market_id):
    """
    Detailed view of a single market.
    """
    opengov_data = api.getMarketData(market_id)
    opengov_data['MapsLink'] = api.getMapsLink(opengov_data)
    try:
        market = Market.objects.get(id=market_id)
    except Market.DoesNotExist:
        print('making a market!')
        market = Market(id=market_id,
                        name=opengov_data['MarketName'],
                        address_street=opengov_data['street'],
                        address_city=opengov_data['city'],
                        address_state=opengov_data['State'],
                        address_zip=opengov_data['zip'])
        market.save()

    market_merged = {**model_to_dict(market), **opengov_data}
    return render(request, 'markets/detail.html', {'market': market_merged})
