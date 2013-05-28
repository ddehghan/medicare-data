import psycopg2
import sys


class HospitalData():
    con = None

    def connect(self):
        self.con = psycopg2.connect(dbname='map', user='db_user', password='db_user')
        self.cur = self.con.cursor()

    def disconnect(self):
        if self.con:
            self.con.close()

        self.con = None

    def get_aquired_conditions(self, provider_id):

        if not self.con:
            self.connect()

        try:

            self.cur.execute('SELECT * from "dHospitalAcquiredCondition" where ProviderId=%d' % provider_id)
            row = self.cur.fetchone()

            return row

        except psycopg2.DatabaseError, e:
            print 'Error %s' % e
            self.disconnect()
            sys.exit(1)
