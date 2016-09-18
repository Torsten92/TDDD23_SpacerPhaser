//Functions are taken directly from: 
//http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript (27-08-2016)
//
// guid() generates a new globally unique id every time it is called. This makes indexing of objects easier 
// to handle since we don't need to find a unique index ourselves.

function guid() {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
}