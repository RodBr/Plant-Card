class PlantCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.sensors = {
      moisture: 'hass:water',
      temperature: 'hass:thermometer',
      intensity: 'hass:white-balance-sunny',
      conductivity: 'hass:emoticon-poop',
      battery: 'hass:battery'
    };

  }

  _computeIcon(sensor, state) {
    const icon = this.sensors[sensor];
    if (sensor === 'battery') {
      if (state <= 5) {
        return `${icon}-alert`;
      } else if (state < 95) {
        return `${icon}-${Math.round((state / 10) - 0.01) * 10}`;
      }
    }
    return icon;
  }

  _click(entity) {
      this._fire('hass-more-info', { entityId: entity });
  }

  _fire(type, detail) {

      const event = new Event(type, {
          bubbles: true,
          cancelable: false,
          composed: true
      });
      event.detail = detail || {};
      this.shadowRoot.dispatchEvent(event);
      return event;
  }

  //Home Assistant will set the hass property when the state of Home Assistant changes (frequent).
  set hass(hass) {
    const _config = this.config;

    var _sensors = [];
    for (var i=0; i < this.config.entities.length; i++) {
     _sensors.push(this.config.entities[i].split(":")); // Split name away from sensor id
    }

    this.shadowRoot.getElementById('container').innerHTML = `
    <style>
    ha-card {
      background-image:url(/local/${this.config.image})
    }
    .header {
      color: white;
      width: 100%;
      background:rgba(0, 0, 0, var(--dark-secondary-opacity));
    }
    </style>
    <div class="content">
      <div id="sensors"></div>
    </div>
    `;

    for (var i=0; i < _sensors.length; i++) {
      var _name = _sensors[i][0];
      var _sensor = _sensors[i][1];
      var _state = hass.states[_sensor].state || "Invalid State";
      var _uom = hass.states[_sensor].attributes.unit_of_measurement || "";
      var _icon = this._computeIcon(_name, _state);
      this.shadowRoot.getElementById('sensors').innerHTML += `
      <div id="sensor${i}" class="sensor">
        <div><ha-icon icon="${_icon}"></ha-icon></div>
        <div>${_name}</div>
        <div style="float:right">${_state}${_uom}</div>
      </div>
      `
     }

     for (var i=0; i < _sensors.length; i++) {
       this.shadowRoot.getElementById('sensor'+[i]).onclick = this._click.bind(this, _sensors[i][1]);
     }
  }

  //  Home Assistant will call setConfig(config) when the configuration changes (rare).
  setConfig(config) {
    if (!config.entities) {
      throw new Error('Please define an entity');
    }

    if (this.shadowRoot.lastChild) this.shadowRoot.removeChild(this.shadowRoot.lastChild);

    this.config = config;

    const card = document.createElement('ha-card');
    card.header = config.title;
    const style = document.createElement('style');

    const content = document.createElement('div');
    content.id = 'container';
    card.appendChild(style);
    card.appendChild(content);
    this.shadowRoot.appendChild(card);

    style.textContent = `
      ha-card {
        position: relative;
        padding: 0;
        color: white;
      }
      ha-card .header {
        color: orange;
        width: 100%;
        background:rgba(0, 0, 0, var(--dark-secondary-opacity));
      }
      .uom {
        color: var(--secondary-text-color);
      }
      ha-icon {
        color: var(--paper-item-icon-color);
        margin-bottom: 8px;
      }
      .content {
        justify-content: space-between;
        padding: 4px 8px;
        font-size: 16px;
        background-color: rgba(0, 0, 0, 0.3);
      }
      .sensor {
        cursor: pointer;
      }
      .sensor div {
        text-align: center;
        display: inline;
      }
      `;
  }

  // The height of your card. Home Assistant uses this to automatically
  // distribute all cards over the available columns.
  getCardSize() {
    return 2;
  }
}

customElements.define('plant-card', PlantCard);
