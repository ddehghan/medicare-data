#!/Users/daviddehghan/.virtualenvs/map/bin/python
import json

import os
import sys

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
        f.write("size_charge,size_pay,lat,lon,charge,pay,name\n")

        min_charge = 10000000
        max_charge = 0
        min_pay = 10000000
        max_pay = 0

        for c in drgs:
            min_charge = min(c.avg_charges, min_charge)
            max_charge = max(c.avg_charges, max_charge)
            min_pay = min(c.avg_total_payments, min_pay)
            max_pay = max(c.avg_total_payments, max_pay)

        for c in drgs:
            f.write("%.2f,%.2f,%s,%s,%s,%s,%s\n" %
                    (scale(c.avg_charges, (min_charge, max_charge), (2, 12)),
                     scale(c.avg_total_payments, (min_pay, max_pay), (2, 12)),
                     c.hospital.lat,
                     c.hospital.lon,
                     c.avg_charges,
                     c.avg_total_payments,
                     c.hospital.name))
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