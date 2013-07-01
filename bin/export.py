from decimal import Decimal

import os
import string
import sys
from project.bin.export_sql import HospitalData
from project.bin.utility import round_, scale

sys.path.append("/Users/daviddehghan/gitroot/hackatons/medicare/project")
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "myproject.settings")
os.environ.setdefault("DEPLOY_ENV", "dev")

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# print PROJECT_ROOT
DATA_ROOT = os.path.join(PROJECT_ROOT, "website", "static", "data")
HTML_ROOT = os.path.join(PROJECT_ROOT, "website", "templates")

from project.website.models import Drg, Charges


def write_options(drgs, file_name):
    with open(os.path.join(HTML_ROOT, file_name + '.html'), 'wb') as f:
        for c1 in Drg.objects.values('category1').distinct():
            f.write('<li>\n')
            f.write('<a href="#">%s</a><ul class="dl-submenu">\n' % c1['category1'])

            for c2 in Drg.objects.filter(category1=c1['category1']).values('category2').distinct():
                f.write('<li>\n')
                f.write('<a href="#">%s</a><ul class="dl-submenu">\n' % c2['category2'])

                for c3 in Drg.objects.filter(category1=c1['category1'], category2=c2['category2']).values(
                        'category3').distinct():

                    for drg in Drg.objects.filter(category1=c1['category1'], category2=c2['category2'],
                                                  category3=c3['category3']):
                        f.write('<li>\n')
                        name = "%s-%s" % (drg.category2, drg.category3)
                        f.write('<a onclick="MEDICARE.get_data(\'%s\', \'%s\');">%s</a>\n' % (
                            drg.drg_id, name, name))
                        f.write('</li>\n')

                f.write('</ul>\n')
                f.write('</li>\n')

            f.write('</ul>\n')
            f.write('</li>\n')

    return


def write_csv(drg, file_name):
    with open(os.path.join(DATA_ROOT, '%s.csv' % file_name), 'wb') as f:
        f.write(
            "size_charge,size_pay,lat,lon,state,charge,pay,AcquiredInfect,AcquiredConditions,PatientSafetySummary,name\n")

        min_charge = 10000000
        max_charge = 0
        min_pay = 10000000
        max_pay = 0

        for c in Charges.objects.filter(drg=drg):
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

        for c in Charges.objects.filter(drg=drg):
            ac = hospital_data.get_aquired_conditions(int(c.hospital.provider_id))

            if not ac:
                ac = [0] * 9

            hospt_name = string.replace(c.hospital.name, ',', '').title()  # escape the ','

            f.write("%.2f,%.2f,%s,%s,%s,%d,%d,%d,%d,%d,%s\n" %
                    (scale(c.avg_charges, (min_charge, max_charge), (Decimal(2), Decimal(30))),
                     scale(c.avg_total_payments, (min_pay, max_pay), (Decimal(2), Decimal(30))),
                     c.hospital.lat,
                     c.hospital.lon,
                     c.hospital.state,
                     round_(c.avg_charges),
                     round_(c.avg_total_payments),
                     ac[0] * 100,
                     ac[1] * 100,
                     ac[2] * 100,
                     hospt_name))

        hospital_data.disconnect()

    return


def export_hospital_list(my_list=None):
    if my_list:
        for drg in Drg.objects.filter(drg_id__in=my_list):
            write_csv(drg, drg.drg_id)

    else:
        for drg in Drg.objects.all():
            write_csv(drg, drg.drg_id)

    return


def export_categories():
    write_options(Drg.objects.all(), 'drg_options')

    return


if __name__ == '__main__':
    # export_categories()
    export_hospital_list(my_list=[39])
    # export_hospital_list()
