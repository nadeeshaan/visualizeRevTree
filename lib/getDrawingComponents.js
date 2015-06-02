  function node (x, y, rev, isLeaf, isDeleted, isWinner, shortDescLen, textObjs, nodeObjs, r) {
    var pos = rev.split('-')[0];
    var id = rev.split('-')[1];
    var opened = false;

    circ(x, y, r, isLeaf, isDeleted, isWinner, nodeObjs, rev);

    var textObj = {
      "stLeft": (x - 40) + "px",
      "stTop": (y - 30) + "px",
      "short": pos + '-' + id.substr(0, shortDescLen),
      "long": pos + '-' + id
    };

    textObjs.push(textObj);
  };

  function circ (x, y, r, isLeaf, isDeleted, isWinner, nodeObjs, rev) {

    var leafStat = '';

    if (isLeaf) {
      leafStat = 'leaf';
    }
    if (isWinner) {
      leafStat = 'winner';
    }
    if (isDeleted) {
      leafStat = 'deleted';
    }

    var nodeObj = {
      "x" : x,
      "y" : y,
      "class" : leafStat,
      "radius" : r,
      "rev" : rev
    };

    nodeObjs.push(nodeObj);
  }


module.exports = function (options) {
    var grid = options.grid;
    var maxX = 10;
    var maxY = 10;
    var levelCount = []; // numer of nodes on some level (pos)
    var lineObjs = [];
    var nodeObjs = [];
    var textObjs = [];

    var map = {}; // map from rev to position

    function drawPath (path) {

      path.reduce(function (prev, current, index, array) {

        var rev = current;
        var isLeaf = index === 0;
        var pos = +rev.split('-')[0];

        if (!levelCount[pos]) {
          levelCount[pos] = 1;
        }

        var x = levelCount[pos] * grid;
        var y = pos * grid;

        if (!isLeaf) {
          var nextRev = path[index - 1];
          var nextX = map[nextRev][0];
          var nextY = map[nextRev][1];

          if (map[rev]) {
            x = map[rev][0];
            y = map[rev][1];
          }

          var lineObj = {
            "x" : x,
            "y" : y,
            "nextX" : nextX,
            "nextY" : nextY
          };

          lineObjs.push(lineObj);
        }

        if (!map[rev]) {
          maxX = Math.max(x, maxX);
          maxY = Math.max(y, maxY);
          levelCount[pos]++;

          node (x, y, rev, isLeaf, rev in options.deleted, rev === options.winner, options.minUniq, textObjs, nodeObjs, options.radius);
          map[rev] = [x, y];
        }
      }, 0);
    }

    options.paths.forEach(drawPath);

    return {
      "lineObjs": lineObjs,
      "textObjs": textObjs,
      "nodeObjs": nodeObjs,
      "maxX": maxX,
      "maxY": maxY
    };
}