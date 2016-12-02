#API Design Notes
api is found at /api


#Sensors
##send sensor data to the server
```
{value:"the value returned from the sensor" , collection_time:"time that sensor was sampled" }
```
Note collection_time is optional. In case sensor does not do own time sampling the time of receipt by the server is placed here instead.

 ```
POST:  /api/sensors/:sensor_id/data
 ```


##obtain all data for a given sensor
```
GET: /api/sensors/:sensor_id/data
```


##obtain the latest sample from a given sensor
```
GET: /api/sensors/:sensor_id/data/latest
```
returns
```
{value:"", collection_time:""}
```

##add or update an existing sensors metadata
```
{sensor_name:"the human friendly sensor name",sensor_description:"a short description of the sensor", data_type:"number"}
```
Note data_type may be any of String, Number or Boolean
```
post: /api/sensors/:sensor_id
```



#Actors
actions that can be requested
