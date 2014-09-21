from django.contrib import admin
from hackthenorth.models import BusinessEntity, MapSession

@admin.register(BusinessEntity)
class BusinessEntityAdmin(admin.ModelAdmin):
    list_display = ('id', 'yelp_id', 'session', 'votes',)


@admin.register(MapSession)
class MapSessionAdmin(admin.ModelAdmin):
    list_display = ('id', 'slug', 'description', 'starting_location')
