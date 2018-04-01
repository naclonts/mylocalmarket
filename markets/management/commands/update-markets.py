"""
Custom command to refresh Markets models.

This command loads a CSV file from the opengov sources and updates the markets table to match the fields in said CSV.
"""

from django.core.management.base import BaseCommand, CommandError
from django.core import exceptions
from django.db import transaction
import markets
from markets.models import Market
import csv
import os.path



MARKET_FIELDS_CSV_TO_MODEL = {
    # Farmer market name and location
    'FMID': 'id',
    'MarketName': 'name',
    'street': 'address_street',
    'city': 'address_city',
    'State': 'address_state',
    'County': 'address_county',
    'zip': 'address_zip',
    'x': 'longitude',
    'y': 'latitude',

    # Timeswebsite
    # 'Season1Date': 'season_date_1',
    # 'Season1Time': 'season_time_1',
    # 'Season2Date': 'season_date_2',
    # 'Season2Time': 'season_time_2',

    # Links
    'Website': 'website',
    'Facebook': 'facebook',
    'Twitter': 'twitter',
    'Youtube': 'youtube',
    'OtherMedia': 'other_media',

    # Boolean fields
    'Bakedgoods': 'has_baked_goods',
    'Cheese': 'has_cheese',
    'Crafts': 'has_crafts',
    'Flowers': 'has_flowers',
    'Eggs': 'has_eggs',
    'Seafood': 'has_seafood',
    'Herbs': 'has_herbs',
    'Vegetables': 'has_vegetables',
    'Honey': 'has_honey',
    'Jams': 'has_jams',
    'Meat': 'has_meat',
    'Nursery': 'has_nursery',
    'Nuts': 'has_nuts',
    'Plants': 'has_plants',
    'Poultry': 'has_poultry',
    'Prepared': 'has_prepared_food',
    'Soap': 'has_soap',
    'Trees': 'has_trees',
    'Wine': 'has_wine',
    'Coffee': 'has_coffee',
    'Beans': 'has_beans',
    'Fruits': 'has_fruits',
    'Grains': 'has_grains',
    'Juices': 'has_juices',
    'Mushrooms': 'has_mushrooms',
    'PetFood': 'has_petfood',
    'Tofu': 'has_tofu',
    'WildHarvested': 'has_wild_harvested',
    'Organic': 'has_organic',
    'Credit': 'has_credit',
    'WIC': 'has_wic',
    'WICcash': 'has_wic_cash',
    'SFMNP': 'has_sfmnp',
    'SNAP': 'has_snap'
}


class Command(BaseCommand):
    help = 'Updates market models with latest data from the US open government data.'

    def handle(self, *args, **options):
        # iterate through CSV file
        data_source = os.path.join(os.path.dirname(markets.__file__), 'market_data.csv')
        with open (data_source, 'r') as f:
            reader = csv.reader(f)
            columns = next(reader)

            # locate the FMID column
            try:
                id_index = columns.index('FMID')
            except ValueError:
                raise CommandError('Couldn\'t find a "FMID" column in data source.')

            # iterate through each market, assigning fields to the database
            # use transaction.atomic() to combine inserts into a single transaction
            with transaction.atomic():
                for data in reader:
                    fmid = data[id_index]
                    market, created = Market.objects.get_or_create(id=fmid)
                    for i in range(0, len(data)):
                        if i == id_index: pass
                        field = columns[i]
                        value = data[i].strip()
                        if value != '' and field in MARKET_FIELDS_CSV_TO_MODEL.keys():
                            model_field = MARKET_FIELDS_CSV_TO_MODEL[field]
                            setattr(market, model_field, clean_value(value))
                    market.save()
        self.stdout.write(self.style.SUCCESS('Successfully updated markets database from CSV.'))

            # Add each column (except FMID, which is already assigned as primary key)
            # for column in columns:
            #     if column != 'FMID':
            #         add_query = 'alter table markets add column %s varchar(255)' % column
            #         cursor.execute(add_query)
            #
            # # Insert data
            # query = 'insert into markets({0}) values ({1})'
            # query = query.format(','.join(columns), ','.join('?' * len(columns)))
            # for data in reader:
            #     cursor.execute(query, data)


# Clean a value from the input CSV file
# Converts Y/N booleans to actual Booleans
def clean_value(value):
    if value == 'Y': return True
    if value == 'N': return False
    if value == '-': return None
    return value
