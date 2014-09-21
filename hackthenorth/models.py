from django.db import models


class BusinessEntity(models.Model):
    votes = models.IntegerField(default=0, blank=True, null=False)

    yelp_id = models.CharField(max_length=1024)

    session = models.ForeignKey('MapSession')
    
    # yelp id and session should be unique together

class MapSession(models.Model):

    slug = models.SlugField(blank=False, null=False, unique=True)

    description = models.CharField(blank=True, null=True, max_length=2056)

    starting_location = models.CharField(max_length=256, unique=False, default="0.00000000000000,0.00000000000000")
    
    def __unicode__(self):
        return self.slug