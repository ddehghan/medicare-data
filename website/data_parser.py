#!/usr/bin/env /var/django/env/my_project/bin/python
import os
import sys

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
print PROJECT_ROOT
print PROJECT_ROOT
print PROJECT_ROOT
#
# sys.path.append(PROJECT_ROOT)
sys.path.append('/Users/daviddehghan/gitroot/hackatons/medicare')
sys.path.append('/Users/daviddehghan/gitroot/hackatons/medicare/myproject')

print sys.path

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "myproject.settings")
os.environ.setdefault("DEPLOY_ENV", "dev")

import csv
import os
from models import Hospital, Drug
from pygeocoder import Geocoder, GeocoderError




def read_hospitals():
    addresses = {}

    with open('website/data.csv', 'rb') as f:
        reader = csv.reader(f)

        rownum = 0
        for row in reader:
            # Save header row.
            if rownum == 0:
                header = row
            else:
                address = "%s, %s, %s, %s" % (row[3], row[4], row[5], row[6])

                addresses[address] = row

            rownum += 1

            # if rownum > 100:
            #     break

        f.close()

    for address in addresses.keys():
        # addresses[address][1], addresses[address][2] = Geocoder.geocode(address).coordinates

        # Drug Definition,Provider Id,Provider Name,Provider Street Address,Provider City,Provider State,Provider Zip Code,Hospital Referral Region Description,
        # Total Discharges , Average Covered Charges , Average Total Payments

        try:
            lat, lon = Geocoder.geocode(address).coordinates
        except GeocoderError:
            lat, lon = (0, 0)

        if not Hospital.objects.filter(provider_id=addresses[address][1]):
            hospital = Hospital()
            hospital.provider_id = addresses[address][1]
            hospital.name = addresses[address][2]
            hospital.street = addresses[address][3]
            hospital.city = addresses[address][4]
            hospital.state = addresses[address][5]
            hospital.zip_code = addresses[address][6]
            hospital.referral_region = addresses[address][7]
            hospital.lat, hospital.lon = lat, lon
            hospital.save()
            # with open('data_out.csv', 'wb') as f:
            #     f.write('size,lat,lon\n')
            #     for address in addresses:
            #         f.write('%f,%f,%f\n' % (addresses[address][0], addresses[address][1], addresses[address][2]))

    return


def read_charges():
    addresses = {}

    with open('website/data.csv', 'rb') as f:
        reader = csv.reader(f)

        rownum = 0
        for row in reader:
            # Save header row.
            if rownum == 0:
                header = row
            else:

                hospital = Hospital.objects.get(provider_id=row[1])

                drug = Drug()
                drug.description = row[0]
                drug.total_discharges = row[8]
                drug.avg_charges = row[9]
                drug.avg_total_payments = row[10]
                drug.hospital = hospital
                drug.save()

            rownum += 1

            # if rownum > 100:
            #     break

        f.close()

    return

