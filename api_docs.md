#API Design Notes
api is found at http://hostname:port/api


#Sensors

## POST: /api/sensors/21fds32f1h2ga

add or update an existing sensors metadata
```
{sensor_name:"the human friendly sensor name",sensor_description:"a short description of the sensor", data_type:"number"}
```
Note data_type may be any of String, Number or Boolean.

Where "21fds32f1h2ga" is a sensor



## POST:  /api/sensors/:sensor_id/data
send sensor data to the server
```
{value:"the value returned from the sensor" , collection_time:"time that sensor was sampled" }
```
Note collection_time is optional. In case sensor does not do own time sampling the time of receipt by the server is placed here instead.


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


#Actors
actions that can be requested
