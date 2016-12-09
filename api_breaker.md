this file contains tests that try to break the application


# Sensors

## POST /api/sensors/465fhfgj4hg5jjfg21s32df

update a NON-EXISTANT sensor
* Content-Type: "application/json"
```
{
  "name":"an impossible sensor name",
  "description":"an impossible description of the sensor"
}
```
---
response:
* Status: 301
