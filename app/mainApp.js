import Mn from 'backbone.marionette';
import HeaderView from './components/collections/header_collection';
import BetslipModel from './components/models/betslip_model';
import BodyCollection from './components/collections/body_collection';
import BodyView from './components/views/bodyView';

const io = require('socket.io-client');

const App = Mn.Application.extend({
  region: '#app_hook',

  initialize: function() {
    this.model = new BetslipModel({});
  },
  
  onBeforeStart: function () {
    this.getSelectionsData()
    .then(res => {
      const headerView = new HeaderView(res.response)
      this.showView(headerView)
    })
    .catch(err => console.error(err));
  },
  
  onStart() {
    this.attachWebSockets();
    console.log(this)
  },

  getSelectionsData(){
    return new Promise((resolve, reject) => {
      //API CALL TO GET SELECTIONS DATA
      const api = 'http://localhost:5000/rest/selections';
      return fetch(api)
        .then(res => res.json())
        .then(json => resolve(this.data = json))
        .catch(err => console.error(err));
    })
  },
  
  attachWebSockets() {
    const socket = io("http://localhost:5000");
    return socket.on('selections', data => {
      // console.log(this);
      this.model = new BetslipModel(data)
      return new BodyView({collection: this.model})
    });
  }
});

const app = new App();

app.start();
