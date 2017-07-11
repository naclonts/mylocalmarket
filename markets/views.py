from django.shortcuts import render, get_object_or_404

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
    market = get_object_or_404(Market, pk=market_id)
    return render(request, 'markets/detail.html', {'market': market})
