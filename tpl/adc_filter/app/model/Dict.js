
Ext.define('adc_filter.model.Dict', {
    extend: 'Ext.data.Model',
    fields: [
        // 1-4 ->　uri | header | body | cookie
        {
            name: 'element',
            convert: function () {
                
            }
        },
        // String 1-64
        {
            name: 'element_name',
            type: 'string'
        },
        // Start index of the appointed content, 1-1500, can be omitted
        {
            name: 'start',
            defaultValue: undefined
        },
        // End index of the appointed content, 1-1500, can be omitted
        {
            name: 'end',
            defaultValue: undefined
        },
        // 1-8 -> exist | not_exist | equal | not_equal | contain | not_contain  | match | not_match
        {
            name: 'operator',
            defaultValue: 1
        },
        // (1-128)
        {
            name: 'arguments',
            type: 'string'
        }]

});