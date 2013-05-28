from decimal import Decimal
import json

import os
import sys
from project.bin.export_sql import HospitalData

sys.path.append("/Users/daviddehghan/gitroot/hackatons/medicare/project")
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "myproject.settings")
os.environ.setdefault("DEPLOY_ENV", "dev")

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# print PROJECT_ROOT
DATA_ROOT = os.path.join(PROJECT_ROOT, "website", "static", "data")

from project.website.models import Hospital, Drug


def get_drg():
    return Drug.objects.values('description').distinct()


def write_options(drg, file_name):
    i = 1

    result = []

    with open(os.path.join(DATA_ROOT, file_name), 'wb') as f:
        for d in drg:
            result.append({"value": i, "text": d['description']})
            i += 1

        f.write(json.dumps(result))

    return


def write_csv(drgs, file_name):
    with open(os.path.join(DATA_ROOT, '%s.csv' % file_name), 'wb') as f:
        f.write(
            "size_charge,size_pay,lat,lon,charge,pay,name,Air,BloodInf,UrinaryInf,Falls double,Mismatch,Objects,Sores,Sugar\n")

        min_charge = 10000000
        max_charge = 0
        min_pay = 10000000
        max_pay = 0

        for c in drgs:
            min_charge = min(c.avg_charges, min_charge)
            max_charge = max(c.avg_charges, max_charge)
            min_pay = min(c.avg_total_payments, min_pay)
            max_pay = max(c.avg_total_payments, max_pay)

        min_charge = min(min_pay, min_charge)
        max_charge = max(max_pay, max_charge)
        min_pay = min(min_charge, min_pay)
        max_pay = max(max_charge, max_pay)

        hospital_data = HospitalData()
        hospital_data.connect()

        for c in drgs:
            ac = hospital_data.get_aquired_conditions(int(c.hospital.provider_id))

            if not ac:
                ac = [0]*9

            f.write("%.2f,%.2f,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s\n" %
                    (scale(c.avg_charges, (min_charge, max_charge), (Decimal(2), Decimal(30))),
                     scale(c.avg_total_payments, (min_pay, max_pay), (Decimal(2), Decimal(30))),
                     c.hospital.lat,
                     c.hospital.lon,
                     c.avg_charges,
                     c.avg_total_payments,
                     c.hospital.name,
                     ac[1], ac[2], ac[3], ac[4], ac[5], ac[6], ac[7], ac[8]))

        hospital_data.disconnect()

    return


def scale(val, src, dst):
    """
    Scale the given value from the scale of src to the scale of dst.
    """
    return ((val - src[0]) / (src[1] - src[0])) * (dst[1] - dst[0]) + dst[0]


def export_data():
    unique_drugs = get_drg()
    write_options(unique_drugs, 'drg_options.json')

    i = 1
    for drg in unique_drugs:
        write_csv(Drug.objects.filter(description=drg['description']), str(i))
        i += 1
        # break

    return


if __name__ == '__main__':
    export_data()