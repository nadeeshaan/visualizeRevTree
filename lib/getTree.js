// module.exports = function (dbUrl, docId) {
//   return db.get(docId).catch(function (err) {
//     if (err.reason !== "deleted") {
//       throw err;
//     }
//   }).then(function(doc){ // get winning revision here
//     var winner = doc._rev;
//     return db.get(docId, {revs: true, open_revs: "all"}).then(function(results){
//       console.log(db);
//       var deleted = {};
//       var paths = results.map(function(res) {
//         res = res.ok; // TODO: what about missing
//         if (res._deleted) {
//           deleted[res._rev] = true;
//         }
//         var revs = res._revisions;
//         return revs.ids.map(function(id, i) {
//           return (revs.start-i) + '-' + id;
//         });
//       });
//       return {
//         paths: paths,
//         deleted: deleted,
//         winner: winner
//       };
//     });
//   });
// };

var CORS_PROXY =  'http://nodejs-neojski.rhcloud.com/';

var PouchDB = require('pouchdb');


module.exports = function (dbUrl, docId) {

  return getDb(dbUrl).then(function(db){
    return db.get(docId).catch(function (err) {
      if (err.reason !== "deleted") {
        throw err;
      }
    }).then(function(doc){ // get winning revision here
      var winner = doc._rev;
      return db.get(docId, {revs: true, open_revs: "all"}).then(function(results){
        console.log(db);
        var deleted = {};
        var paths = results.map(function(res) {
          res = res.ok; // TODO: what about missing
          if (res._deleted) {
            deleted[res._rev] = true;
          }
          var revs = res._revisions;
          return revs.ids.map(function(id, i) {
            return (revs.start-i) + '-' + id;
          });
        });
        return {
          paths: paths,
          deleted: deleted,
          winner: winner
        };
      });
    });    
  });
};

function getDb (dbUrl) {
  return new PouchDB(dbUrl).catch(function (err) {
    console.log('first try error', err);

    if (isLocalhost(dbUrl) && !isLocalhost(location.href)) {
      alert('Cannot reach your localhost from the web. Try something online.');
      throw 'Localhost not possible';
    }

    // Likely a CORS problem
    if (err && err.status === 500) {
      error('Re-trying with cors proxy.')

      dbUrl = CORS_PROXY + dbUrl.replace(/https?:\/\//, '');
      return new PouchDB(dbUrl);
    } else {
      throw err;
    }
  });


}
