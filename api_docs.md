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
response:
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
response:
* Status: 200


## GET /api/sensors/{sensor_id}

get an existing sensors metadata
* Content-Type: "application/json"
---
response:
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
---
response:
* Status: 200

## GET /api/sensors/{sensor_id}/data/latest

obtain the latest sample from a given sensor
* Content-Type: "application/json"
---
response:
* Status: 200
```json
{
  "value":12,
  "collection_time":"2016-12-02T08:36:55.743Z"
}
```


## GET /api/sensors/{sensor_id}/data

obtain all data for a given sensor
* Content-Type: "application/json"
---
response:
* Status: 200
```json
[
    {
      "value":12,
      "collection_time":"2016-12-02T08:36:55.743Z"
    }
]
```

# Actors

## POST /api/actors

add an actor to the database
* Content-Type: "application/json"
```
{
  "name":"lamp",
  "description":"turns the lamp on/off",
  "state_type":"boolean"
}
```
---
response:
* Status: 200
* Data.id: /^[a-f\d]{24}$/ // The nodes unique {actor_id}.

## GET /api/actors/{actor_id}

get the details of a specific actor
* Content-Type: "application/json"
---
response:
* Status: 200
```json
{
  "name":"lamp",
  "description":"turns the lamp on/off",
  "state_type":"boolean"
}
```

## POST /api/actors/{actor_id}

update an actor entry in the database
* Content-Type: "application/json"
```
{
  "description":"controls the brightness of a lamp",
  "state_type":"number"
}
```
---
response:
* Status: 200

# Behaviours

## POST /api/behaviours

add a new behaviour
* Content-Type: "application/json"
```
{
  "enabled": true,
  "description":"a behaviour for testing",
  "sensor":"{sensor_id}",
  "actor":"{actor_id}",
  "action": 123,
  "condition": "equal",
  "value": 10
}
```
---
response:
* Status: 200


## POST /api/sensors/{sensor_id}/data

send sensor data to the , this time to trigger a behaviour
* Content-Type: "application/json"
```
{
  "value":10,
  "collection_time":"2016-12-03T08:36:55.743Z"
}
```
---
response:
* Status: 200
