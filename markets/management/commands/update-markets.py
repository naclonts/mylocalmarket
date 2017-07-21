"""
Custom command to refresh Markets models.

This command loads a CSV file from the opengov sources [TODO: load from site!] and updates the markets table to match the fields in said CSV.
"""

from django.core.management.base import BaseCommand, CommandError
from django.core import exceptions
from django.db import transaction
import markets
from markets.models import Market
import csv
import os.path



MARKET_FIELDS_CSV_TO_MODEL = {
    'FMID': 'id',
    'MarketName': 'name',
    'Website': 'website',
    'street': 'address_street',
    'city': 'address_city',
    'State': 'address_state',
    'County': 'address_county',
    'zip': 'address_zip',
    'x': 'longitude',
    'y': 'latitude',
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
                            setattr(market, model_field, value)
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
