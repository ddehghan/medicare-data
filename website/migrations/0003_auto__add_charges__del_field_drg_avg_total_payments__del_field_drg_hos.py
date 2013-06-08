# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Charges'
        db.create_table(u'website_charges', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('total_discharges', self.gf('django.db.models.fields.IntegerField')(default=0)),
            ('avg_charges', self.gf('django.db.models.fields.DecimalField')(default=0, max_digits=10, decimal_places=2)),
            ('avg_total_payments', self.gf('django.db.models.fields.DecimalField')(default=0, max_digits=10, decimal_places=2)),
            ('drg', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['website.Drg'], null=True, blank=True)),
            ('hospital', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['website.Hospital'], null=True, blank=True)),
        ))
        db.send_create_signal(u'website', ['Charges'])

        # Deleting field 'Drg.avg_total_payments'
        db.delete_column(u'website_drg', 'avg_total_payments')

        # Deleting field 'Drg.hospital'
        db.delete_column(u'website_drg', 'hospital_id')

        # Deleting field 'Drg.avg_charges'
        db.delete_column(u'website_drg', 'avg_charges')

        # Deleting field 'Drg.total_discharges'
        db.delete_column(u'website_drg', 'total_discharges')


    def backwards(self, orm):
        # Deleting model 'Charges'
        db.delete_table(u'website_charges')


        # User chose to not deal with backwards NULL issues for 'Drg.avg_total_payments'
        raise RuntimeError("Cannot reverse this migration. 'Drg.avg_total_payments' and its values cannot be restored.")
        # Adding field 'Drg.hospital'
        db.add_column(u'website_drg', 'hospital',
                      self.gf('django.db.models.fields.related.ForeignKey')(to=orm['website.Hospital'], null=True, blank=True),
                      keep_default=False)


        # User chose to not deal with backwards NULL issues for 'Drg.avg_charges'
        raise RuntimeError("Cannot reverse this migration. 'Drg.avg_charges' and its values cannot be restored.")
        # Adding field 'Drg.total_discharges'
        db.add_column(u'website_drg', 'total_discharges',
                      self.gf('django.db.models.fields.IntegerField')(default=0),
                      keep_default=False)


    models = {
        u'auth.group': {
            'Meta': {'object_name': 'Group'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '80'}),
            'permissions': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['auth.Permission']", 'symmetrical': 'False', 'blank': 'True'})
        },
        u'auth.permission': {
            'Meta': {'ordering': "(u'content_type__app_label', u'content_type__model', u'codename')", 'unique_together': "((u'content_type', u'codename'),)", 'object_name': 'Permission'},
            'codename': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'content_type': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['contenttypes.ContentType']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        },
        u'auth.user': {
            'Meta': {'object_name': 'User'},
            'date_joined': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'email': ('django.db.models.fields.EmailField', [], {'max_length': '75', 'blank': 'True'}),
            'first_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'groups': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['auth.Group']", 'symmetrical': 'False', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_active': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'is_staff': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'is_superuser': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'last_login': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'last_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'password': ('django.db.models.fields.CharField', [], {'max_length': '128'}),
            'user_permissions': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['auth.Permission']", 'symmetrical': 'False', 'blank': 'True'}),
            'username': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '30'})
        },
        u'contenttypes.contenttype': {
            'Meta': {'ordering': "('name',)", 'unique_together': "(('app_label', 'model'),)", 'object_name': 'ContentType', 'db_table': "'django_content_type'"},
            'app_label': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'model': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        },
        u'website.charges': {
            'Meta': {'object_name': 'Charges'},
            'avg_charges': ('django.db.models.fields.DecimalField', [], {'default': '0', 'max_digits': '10', 'decimal_places': '2'}),
            'avg_total_payments': ('django.db.models.fields.DecimalField', [], {'default': '0', 'max_digits': '10', 'decimal_places': '2'}),
            'drg': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['website.Drg']", 'null': 'True', 'blank': 'True'}),
            'hospital': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['website.Hospital']", 'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'total_discharges': ('django.db.models.fields.IntegerField', [], {'default': '0'})
        },
        u'website.drg': {
            'Meta': {'object_name': 'Drg'},
            'category1': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'category2': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'category3': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'description': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'drg_id': ('django.db.models.fields.IntegerField', [], {'default': '0'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'})
        },
        u'website.hospital': {
            'Meta': {'object_name': 'Hospital'},
            'city': ('django.db.models.fields.CharField', [], {'max_length': '15', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'lat': ('django.db.models.fields.DecimalField', [], {'max_digits': '10', 'decimal_places': '5'}),
            'lon': ('django.db.models.fields.DecimalField', [], {'max_digits': '10', 'decimal_places': '5'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'provider_id': ('django.db.models.fields.CharField', [], {'max_length': '6', 'blank': 'True'}),
            'referral_region': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'state': ('django.db.models.fields.CharField', [], {'max_length': '3', 'blank': 'True'}),
            'street': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'zip_code': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'})
        },
        u'website.landingpage': {
            'Meta': {'object_name': 'LandingPage'},
            'comment': ('django.db.models.fields.CharField', [], {'max_length': '1000', 'blank': 'True'}),
            'datetime': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'email': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'ip_address': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'level': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'variation': ('django.db.models.fields.CharField', [], {'max_length': '10', 'blank': 'True'})
        },
        u'website.userprofile': {
            'Meta': {'object_name': 'UserProfile'},
            'bio': ('django.db.models.fields.CharField', [], {'max_length': '2000', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'user': ('django.db.models.fields.related.OneToOneField', [], {'to': u"orm['auth.User']", 'unique': 'True'})
        }
    }

    complete_apps = ['website']