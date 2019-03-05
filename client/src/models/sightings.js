const RequestHelper = require('../helpers/request_helper.js');
const PubSub = require('../helpers/pub_sub.js');

const Sightings = function (url) {
  this.url = url;
  this.request = new RequestHelper(this.url);
};

Sightings.prototype.bindEvents = function () {
  PubSub.subscribe('SightingView:sighting-delete-clicked', (evt) => {
    this.deleteSighting(evt.detail);
  });
  // added a postSighting subsciption.
  PubSub.subscribe('SightingView:sighting-submitted',(evt)=>{
      this.postSighting(evt.detail);
  });
};

Sightings.prototype.getData = function () {
  this.request.get()
    .then((sightings) => {
      PubSub.publish('Sightings:data-loaded', sightings);
    })
    .catch(console.error);
};

Sightings.prototype.deleteSighting = function (sightingId) {
  this.request.delete(sightingId)
    .then((sightings) => {
      PubSub.publish('Sightings:data-loaded', sightings);
    })
    .catch(console.error);
};

//postSighting will use the post in RequestHelper and publishs all sightings as RequestHelper returns all sightings.
Sightings.prototype.postSighting = function(sighting){
  const request = new RequestHelper(this.url);
  request.post(sighting)  // post request is done by RequestHelper
    .then((sightings)=>{ // prepared request is received with all sightings ready for publishing.
      PubSub.publish('Sightings:data-loaded',sightings); // all sightings published.
    })
    .catch(console.error);
};

module.exports = Sightings;
