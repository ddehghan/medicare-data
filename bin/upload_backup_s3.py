import os
import boto
import sys
from boto.s3.key import Key
import datetime

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, PROJECT_ROOT)

FILE_NAME = 'latest_upload.dump'

# Full filesystem path to the project.
from myproject.settings_local_dev import AWS_SECRET_ACCESS_KEY, AWS_ACCESS_KEY_ID


conn = boto.connect_s3(AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)
bucket_name = 'map-db-backup'

bucket = conn.create_bucket(bucket_name)

testfile = os.path.join(PROJECT_ROOT, FILE_NAME)

print 'Uploading %s to Amazon S3 bucket %s' % (testfile, bucket_name)


def percent_cb(complete, total):
    sys.stdout.write('.')
    sys.stdout.flush()


k = Key(bucket)
k.key = FILE_NAME + '_' + str(datetime.datetime.now().microsecond)
k.set_contents_from_filename(testfile, cb=percent_cb, num_cb=10)
k.set_canned_acl('public-read')

print '\n\nFile URL:\n\nhttps://s3.amazonaws.com/map-db-backup/%s' % k.key
