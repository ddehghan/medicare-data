import os
from django.contrib.auth.decorators import login_required
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.http import HttpResponse
from django.core.cache import cache

import redis

from website.models import LandingForm, ContributeForm
from website.models import Hospital, Drug
from project.myproject.settings import PROJECT_ROOT

DEPLOY_ENV = os.environ['DEPLOY_ENV']

if DEPLOY_ENV == 'dev':
    from myproject.settings_local_dev import *

elif DEPLOY_ENV == 'prod':
    from myproject.settings_local_prod import *


def home(request):
    return render_to_response('login.html', {
        'a': 'a',
    }, context_instance=RequestContext(request))


def scale(val, src, dst):
    """
    Scale the given value from the scale of src to the scale of dst.
    """
    return ((val - src[0]) / (src[1] - src[0])) * (dst[1] - dst[0]) + dst[0]


def charges(reques, drug):
    r = redis.from_url(REDIS_URL) #redis.StrictRedis(host=REDIS_SERVER,  port=18654, db=0)
    result = r.get(drug)

    if not result:
        drugs = Drug.objects.filter(description=drug)

        result = "size,lat,lon,price,name\n"

        data = []
        for d in drugs:
            if not d.hospital.lat == 0 and not d.hospital.lon == 0:
                data.append([d.avg_charges, d.hospital.lat, d.hospital.lon, d.hospital.name])

        min_price = 10000000
        max_price = 0
        for d in data:
            min_price = min(d[0], min_price)
            max_price = max(d[0], max_price)

        for d in data:
            result += "%s,%s,%s,%s,%s\n" % (scale(d[0], (min_price, max_price), (2, 12)), d[1], d[2], d[0], d[3])

        r.set(drug, result)

    return HttpResponse(result, mimetype="text")


@login_required
def private(request):
    return render_to_response('private.html', {
        'a': 'a',
    }, context_instance=RequestContext(request))


def login_test(request):
    return render_to_response('login.html', {
        'a': 'a',
    }, context_instance=RequestContext(request))


def zipcode(request, zipcode):

    data = cache.get('data')

    if not data:
        import csv

        print "warmup cache  ------------" + zipcode + "-----"

        data = {}
        with open(os.path.join(PROJECT_ROOT, 'bin/data/zipcodes.csv'), 'rU')as f:
            reader = csv.reader(f)

            for row in reader:
                data[str(row[0])] = '{ "lat": %s, "lon": %s }' % (row[1], row[2])

            cache.set('data', data)

            f.close()

    return HttpResponse(data[zipcode], mimetype="application/json")


def index(request):
    # Show the sign page and collect emails

    show_invite = True
    if request.method == "POST":
        myform = LandingForm(request.POST)
        landing_instance = myform.save(commit=False)
        if myform.is_valid():
            landing_instance.ip_address = request.META['REMOTE_ADDR']
            landing_instance.save()
            show_invite = False

            # send_email("MY SITE: Newsletter signup", "email=" + request.POST["email"])

        else:
            return HttpResponse("error")

    myform = LandingForm()
    return render_to_response('index.html', {
        "myform": myform,
        "show_invite": show_invite
    }, context_instance=RequestContext(request))


def contribute(request):
    # Show the sign page and collect emails

    show_invite = True
    if request.method == "POST":
        myform = ContributeForm(request.POST)
        landing_instance = myform.save(commit=False)
        if myform.is_valid():
            landing_instance.ip_address = request.META['REMOTE_ADDR']
            landing_instance.save()
            show_invite = False

            # send_email("MY SITE: Contact Us signup", "email=" + request.POST["email"])

        else:
            return HttpResponse("error")

    myform = ContributeForm()
    return render_to_response('contribute.html', {
        "myform": myform,
        "show_invite": show_invite
    }, context_instance=RequestContext(request))
