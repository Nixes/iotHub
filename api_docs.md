api is found at http://hostname:port/api


# Sensors


## POST /api/sensors
add a sensor and optional metadata to the database
```
{name:"the human friendly sensor name", description:"a short description of the sensor"}
```
---
* Status: 200
* Data.success: true
* Data.id: /^[a-f\d]{24}$/ // The nodes unique {sensor_id}.


## POST /api/sensors/{sensor_id}
update an existing sensors metadata
```
{name:"the human friendly sensor name",description:"a different short description of the sensor"}
```
---
* Status: 200

## GET /api/sensors/{sensor_id}
get an existing sensors metadata
---
* Status: 200
```
{name:"the human friendly sensor name",description:"a different short description of the sensor"}
```

## POST /api/sensors/{sensor_id}/data
send sensor data to the server
```
{value:"12" , collection_time:"" }
```
'value' is a js number, 'collection_time' is a js Date
Note collection_time is optional. In case sensor does not do own time sampling the time of receipt by the server is placed here instead.
---
* Status: 200


## GET /api/sensors/{sensor_id}/data
obtain all data for a given sensor
---
* Status: 200


## GET /api/sensors/{sensor_id}/data/latest
obtain the latest sample from a given sensor
---
* Status: 200
```
{value:"12", collection_time:""}
```
