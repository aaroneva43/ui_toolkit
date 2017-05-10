

Ext.define('adc_filter.data.Dict', function () {
    var dict = {
        element: function (v) {

            var data = [['1', 'uri'], ['2', 'header'], ['3', 'body'], ['4', 'cookie']];

            return v ? Ext.Array.findBy(data, function(a) {return a[0] == v; })[1] : data;

        },
        operator: function (v) {
            var data = [['1', 'and'], ['2', 'or']];

            return v ? Ext.Array.findBy(data, function(a) {return a[0] == v; })[1] : data;
        }
    };

    return {
        statics: {
            get: function (p, v) {
                return v ?
                    (Ext.isFunction(dict[p]) ? dict[p](v) : dict[p][v]) :
                    (Ext.isFunction(dict[p]) ? dict[p]() : dict[p]);
            }
        }
    };
});