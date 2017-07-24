from django import forms

class SearchForm(forms.Form):
    search_value = forms.CharField(max_length=400)
