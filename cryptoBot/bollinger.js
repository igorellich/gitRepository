'use strict';

module.exports = function(accessor_bollinger, plot, plotMixin) {  // Injected dependencies
  return function() { // Closure function
    var p = {},  // Container for private, direct access mixed in variables
        upperLine = plot.pathLine(),
        middleLine = plot.pathLine(),
        lowerLine = plot.pathLine();

    function bollinger(g) {
      var group = p.dataSelector(g);
      group.entry.append('path').attr('class', 'upper');
      group.entry.append('path').attr('class', 'middle');
      group.entry.append('path').attr('class', 'lower');
      group.entry.append('path').attr('class', 'band');
      bollinger.refresh(g);
    }

    bollinger.refresh = function(g) {
      refresh(p.dataSelector.select(g), upperLine, middleLine, lowerLine);
    };

    function binder() {
      upperLine.init(p.accessor.d, p.xScale, p.accessor.upper, p.yScale);
      middleLine.init(p.accessor.d, p.xScale, p.accessor.middle, p.yScale);
      lowerLine.init(p.accessor.d, p.xScale, p.accessor.lower, p.yScale);
    }

    // Mixin 'superclass' methods and variables
    plotMixin(bollinger, p).plot(accessor_bollinger(), binder).dataSelector(plotMixin.dataMapper.array);
    binder();

    return bollinger;
  };
};

function refresh(selection, upperLine, middleLine, lowerLine) {
  selection.select('path.upper').attr('d', upperLine);
  selection.select('path.middle').attr('d', middleLine);
  selection.select('path.lower').attr('d', lowerLine);
  var bandLine = buildBandLine(selection);
  selection.select('path.band').attr('d', bandLine);
}

// [caos30 2018-04-02 patch] draw the 2 bands as a unique shape

function buildBandLine(selection) {
        var upperLine = selection.select('path.upper').attr('d');
        var lowerLine = selection.select('path.lower').attr('d');
        var sp6 = [];
    // Add the nodes of the first path
        var band_d = upperLine;
    // Split the second path and get the last point
        var sp2 = String(lowerLine).split('C');
        var sp2_last = (sp2[(sp2.length - 1)]).split(',');
    // Add a line to the last point of second path
        band_d += 'L' + sp2_last[4] + ',' + sp2_last[5];
    // Add each point of this lower path to the band (in reverse order!)
        sp2.reverse();
        var first_point;
        sp2.forEach(function(element){
            if (element.substr(0,1)=='M'){
                first_point = element.substr(1);
            }else{
                sp6 = element.split(',');
                band_d += 'C' + sp6[4] + ',' + sp6[5] + ',' + sp6[2] + ',' + sp6[3] + ',' + sp6[0] + ',' + sp6[1];
            }
        });
    // add a L to the last point
        band_d += 'L' + first_point;
    // Split the first path to get the first point
        var sp1 = String(upperLine).split('C');
    // add a line to the first node of the first path
        band_d += 'L' + (sp1[0]).substr(1);
    return band_d;
}
