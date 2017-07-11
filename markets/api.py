import requests

BASE_API_URL = 'http://127.0.0.1:5000/yourmarket/api/'
def getMarketData(id):
    """
    Return opengov data for market with FMID [id]. In JSON dictionary format.
    """
    response = requests.get(BASE_API_URL + 'id/' + id)
    return response.json()
