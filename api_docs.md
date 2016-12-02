api is found at http://hostname:port/api


# Sensors

## POST /api/sensors

add a sensor and optional metadata to the database
* Content-Type: "application/json"
```
{
  "name":"a human friendly sensor name",
  "description":"a short description of the sensor"
}
```
---
* Status: 200
* Data.id: /^[a-f\d]{24}$/ // The nodes unique {sensor_id}.


## POST /api/sensors/{sensor_id}

update an existing sensors metadata
* Content-Type: "application/json"
```
{
  "name":"a DIFFERENT human friendly sensor name",
  "description":"a DIFFERENT short description of the sensor"
}
```
---
* Status: 200


## GET /api/sensors/{sensor_id}

get an existing sensors metadata
* Content-Type: "application/json"
---
* Status: 200
```json
{
  "name":"a DIFFERENT human friendly sensor name",
  "description":"a DIFFERENT short description of the sensor"
}
```


## POST /api/sensors/{sensor_id}/data

send sensor data to the server
* Content-Type: "application/json"
```
{
  "value":12,
  "collection_time":"2016-12-02T08:36:55.743Z"
}
```
'value' is a js number, 'collection_time' is a js Date

Note collection_time is optional. In case sensor does not do own time sampling the time of receipt by the server is placed here instead.
---
* Status: 200


## GET /api/sensors/{sensor_id}/data

obtain all data for a given sensor
* Content-Type: "application/json"
---
* Status: 200
```json
[
  {

    "value":12,
    "collection_time":"2016-12-02T08:36:55.743Z"
  }
]
```


## GET /api/sensors/{sensor_id}/data/latest

obtain the latest sample from a given sensor
* Content-Type: "application/json"
---
* Status: 200
```json
{
  "value":12,
  "collection_time":"2016-12-02T08:36:55.743Z"
}
```