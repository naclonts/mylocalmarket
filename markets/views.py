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
    try:
        market = Market.objects.get(id=market_id)
    except Market.DoesNotExist:
        print('making a market!')
        data = api.getMarketData(market_id)
        market = Market(id=market_id,
                        name=data['MarketName'],
                        address_street=data['street'],
                        address_city=data['city'],
                        address_state=data['State'],
                        address_zip=data['zip'])
        market.save()
    return render(request, 'markets/detail.html', {'market': market})
