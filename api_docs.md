api is found at http://hostname:port/api


# Sensors


## POST /api/sensors
add a sensor and optional metadata to the database
```
{name:"the human friendly sensor name", description:"a short description of the sensor"}
```
```
* Data.UserID: /.*/ // The nodes unique {id}.
```

Note data_type may be any of String, Number or Boolean.


## POST /api/sensors/21fds32f1h2ga

update an existing sensors metadata
```
{name:"the human friendly sensor name",description:"a different short description of the sensor"}
```
Where "21fds32f1h2ga" is a sensor



## POST /api/sensors/:sensor_id/data
send sensor data to the server
```
{value:"the value returned from the sensor" , collection_time:"" }
```
Note collection_time is optional. In case sensor does not do own time sampling the time of receipt by the server is placed here instead.


## GET /api/sensors/:sensor_id/data
obtain all data for a given sensor


## GET /api/sensors/:sensor_id/data/latest
obtain the latest sample from a given sensor
returns
```
{value:"", collection_time:""}
```
