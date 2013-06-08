#!/Users/daviddehghan/.virtualenvs/map/bin/python
import os
import sys
import csv
from pygeocoder import Geocoder, GeocoderError

sys.path.append("/Users/daviddehghan/gitroot/hackatons/medicare/project")
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "myproject.settings")
os.environ.setdefault("DEPLOY_ENV", "dev")

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# print PROJECT_ROOT

from project.website.models import Hospital, Drg, Charges


def read_hospitals():
    addresses = {}

    with open('data/data.csv', 'rb') as f:
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

    with open('data/data.csv', 'rb') as f:
        reader = csv.reader(f)

        rownum = 0
        for row in reader:
            # Save header row.
            if rownum == 0:
                header = row
            else:

                hospital = Hospital.objects.get(provider_id=row[1])
                drg = Drg.objects.get(description=row[0])

                charge = Charges()
                charge.total_discharges = row[8]
                charge.avg_charges = row[9]
                charge.avg_total_payments = row[10]
                charge.hospital = hospital
                charge.drg = drg
                charge.save()

            rownum += 1

            # if rownum > 100:
            #     break

        f.close()

    return


def fix_addresses():
    hospitals = Hospital.objects.filter(lat=0)

    for h in hospitals:

        # bug Some addressed in the data have the zero in the zipcode cut off
        # address = "%s, %s, %s, %s, 0%s" % (h.name, h.street, h.city, h.state, h.zip_code)

        address = "%s, %s, %s, %s, %s" % (h.name, h.street, h.city, h.state, h.zip_code)

        try:
            lat, lon = Geocoder.geocode(address=address).coordinates
            h.lat = lat
            h.lon = lon
            h.save()

            print h.name
            print lat, lon

        except GeocoderError:
            print address
            print "err"


def import_drg():

    with open('data/DRGCommonNames.csv', 'Urb') as f:
        reader = csv.reader(f)

        rownum = 0
        for row in reader:
            # Save header row.
            if rownum == 0:
                header = row
            else:
                drg = Drg()
                drg.description = row[0]
                drg.category1 = row[1]
                drg.category2 = row[2]
                drg.category3 = row[3]
                drg.drg_id = int(row[4])
                drg.save()

            rownum += 1

        f.close()

    return


if __name__ == '__main__':
    # import_drg()
    read_charges()
