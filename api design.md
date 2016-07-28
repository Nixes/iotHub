#API Design Notes
 api is found at /api

##to send sensor data to the application

post:
```
{sensor_id:"some sensor id here", value:"the value returned from the sensor" , collection_time:"time that sensor was sampled" }
```
Note collection_time is optional. In case sensor does not do own time sampling the time of receipt by the server is placed here instead.

to:
 ```
  /api/sensor/data
 ```

##to obtain all data for a given sensor

get:
```
/api/sensor/:sensor_id/data
```

##to obtain the latest sample from a given sensor

get:
```
/api/sensor/:sensor_id/data/latest
```


##to update an existing sensors metadata
post:
```
{sensor_name:"the human friendly sensor name",sensor_description:"a short description of the sensor", data_type:"number"}
```

Note data_type may be any of String, Number or Boolean

to:
```
/api/sensor/:sensor_id
```
