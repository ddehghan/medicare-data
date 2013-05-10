from django.db import models
from django.forms import ModelForm, Textarea
from django.contrib.auth.models import User
from django.db.models.signals import post_save

# Drug Definition,Provider Id,Provider Name,Provider Street Address,Provider City,Provider State,Provider Zip Code,Hospital Referral Region Description,
# Total Discharges , Average Covered Charges , Average Total Payments


class Hospital(models.Model):
    provider_id = models.CharField(max_length=6, blank=True)
    name = models.CharField(max_length=100, blank=True)
    street = models.CharField(max_length=100, blank=True)
    city = models.CharField(max_length=15, blank=True)
    state = models.CharField(max_length=3, blank=True)
    zip_code = models.CharField(max_length=100, blank=True)
    referral_region = models.CharField(max_length=100, blank=True)
    lat = models.DecimalField(max_digits=10, decimal_places=5)
    lon = models.DecimalField(max_digits=10, decimal_places=5)


class Drug(models.Model):
    description = models.CharField(max_length=100, blank=True)
    total_discharges = models.IntegerField(default=0)
    avg_charges = models.DecimalField(max_digits=10, decimal_places=2)
    avg_total_payments = models.DecimalField(max_digits=10, decimal_places=2)
    hospital = models.ForeignKey(Hospital, null=True, blank=True)


class LandingPage(models.Model):
    email = models.CharField(max_length=100, blank=True)
    name = models.CharField(max_length=100, blank=True)
    datetime = models.DateTimeField(auto_now_add=True)
    ip_address = models.CharField(max_length=100, blank=True)
    variation = models.CharField(max_length=10, blank=True)
    level = models.CharField(max_length=100, blank=True)

    comment = models.CharField(max_length=1000, blank=True)

    def __unicode__(self):
        return self.email


class LandingForm(ModelForm):
    class Meta:
        model = LandingPage
        fields = ('email', )


class ContributeForm(ModelForm):
    class Meta:
        model = LandingPage
        fields = ('name', 'email', 'comment', )

        widgets = {
            'comment': Textarea(attrs={'cols': 80, 'rows': 10}),
        }


###########  Extend user profile
# Docs: http://stackoverflow.com/a/965883/705945

class UserProfile(models.Model):
    user = models.OneToOneField(User)
    bio = models.CharField(max_length=2000, blank=True)

    def __str__(self):
        return "%s's profile" % self.user


def create_user_profile(sender, instance, created, **kwargs):
    if created:
        profile, created = UserProfile.objects.get_or_create(user=instance)


post_save.connect(create_user_profile, sender=User)
###########  Extend user profile  - END
