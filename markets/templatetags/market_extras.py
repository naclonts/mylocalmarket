from django import template

from markets.models import get_or_create_profile

register = template.Library()

# Custom template filter to see if user has favorited a market
@register.filter(name='has_favorite', is_safe=True)
def has_favorite(request, market_id):
    """
    Returns {bool}: True if user has the market with market_id in their
    favorites list; otherwise, false.
    """
    profile = get_or_create_profile(request.user, request.session)
    return profile.favorite_markets.filter(id=market_id).exists()
