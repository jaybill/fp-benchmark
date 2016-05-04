var Benchmark = require("benchmark");

var _ = require("lodash/fp");
var R = require("ramda");

var companies = [
  {
    name: "tw",
    since: 1993
  },
  {
    name: "pucrs",
    since: 1930
  },
  {
    name: "tw br",
    since: 2009
  }
];

var suite = new Benchmark.Suite;


// add tests
suite.add('lodashfp', function() {
  var ldfp = _.pipe(
    _.filter(_.pipe(_.property("name"), _.startsWith("tw"))),
    _.map(_.clone),
    _.each(function(o) {
      o.name = o.name.toUpperCase();
    }),
    _.orderBy("since", "desc")
  )(companies);

}).add('ramda', function() {
  var rmd = R.compose(
    R.reverse,
    R.sortBy(R.prop("since")),
    R.map(R.over(R.lensProp("name"), R.toUpper)),
    R.filter(R.where({
      name: R.test(/^tw/)
    }))
  )(companies);
})
  // add listeners
  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  // run async
  .run({
    'async': false
  });
