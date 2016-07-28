#API Design Notes
 api is found at /api

##send sensor data to the server
```
{sensor_id:"some sensor id here", value:"the value returned from the sensor" , collection_time:"time that sensor was sampled" }
```
Note collection_time is optional. In case sensor does not do own time sampling the time of receipt by the server is placed here instead.

 ```
POST:  /api/sensor/data
 ```


##obtain all data for a given sensor
```
GET: /api/sensor/:sensor_id/data
```


##obtain the latest sample from a given sensor
```
GET: /api/sensor/:sensor_id/data/latest
```


##update an existing sensors metadata
```
{name:"the human friendly sensor name",sensor_description:"a short description of the sensor", data_type:"number"}
```
Note data_type may be any of String, Number or Boolean
```
post: /api/sensor/:sensor_id
```
