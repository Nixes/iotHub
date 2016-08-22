# iotHub
A node application for displaying data gathered from sensors, pretty MEAN.

This is the eventual replacement for my sensorNet project.

Companion arduino library is found https://github.com/Nixes/iotHub_lib

For now there is no intention to support glue modules for different protocols, in the interest of preventing bloat. That deosn't stop you from developing external bridges yourself.

#Features
- Local: Your data is under your control, nothing leaves the local network
- One Language: Javascript all the way down.
- Cross Platform: Runs on anything with a node implementation
- Arduino Library: Comes with a companion arduino library to make adding sensors easy
- Standardised Database: All data stored in a mongo database, no weird proprietry solutions
- REST API: Easy to use REST API for both sensors and data queries
- Built in Web UI: view and control your environment from any device with a browser
- Event based: Sensors only send data when they have something to show for it, no polling

#Installation

grab the latest version from github
```
git clone  https://github.com/Nixes/iotHub.git
cd iotHub
```

prepare dependencies
```
npm install
```

running
```
node bin/www
```

Make sure you have a MongoDB server running first.
