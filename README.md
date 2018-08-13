# Plant Card

A card to report MiFlora plant sensors based on the HA Plant Card

![plant-card](plant-card.png)

## Options

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| type | string | **Required** | `custom:plant-card`
| title | string | **Required** | Name of the plant being monitored
| image | string | **Rquired** | Path to an image of the plant being monitored
| entities | list | **Required** | A list sensors to be monitored

| title | string | 📣 Updates | Name to display on card

## Installation

1. Install the `plant-card` component by copying `plant-card.js` to `<config directory>/www/plant-card.js`


2. Link `plant-card` inside your `ui-lovelace.yaml`

```yaml
resources:
  - url: /local/plant-card.js
    type: js
```

3. Add a custom card in your `ui-lovelace.yaml`

```yaml
- type: custom:plant-card
  title: 'Calathea Zebrina'
  image: images/calathea-zebrina.jpg
  entities:
  - moisture:sensor.plant_1_moisture
  - intensity:sensor.plant_1_light_intensity
  - conductivity:sensor.plant_1_conductivity
  - battery:sensor.plant_1_battery
  - temperature:sensor.plant_1_temperature
```
