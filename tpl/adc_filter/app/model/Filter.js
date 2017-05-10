
Ext.define('adc_filter.model.Filter', {
    extend: 'Ext.data.Model',
    idProperty: 'name',
    fields: [
        // 1-96
        {
            name: 'name',
            type: 'string',
            idfield: true
        }, 
        // dynamic int 0-255
        {
            name: 'rule_count',
            type: 'int',
            defaultValue: 0
        },
        // 1-128
        {
            name: 'description',
            type: 'string'
        }, 
        // 1-2 -> and | or
        {
            name: 'logic',
            type: 'int',
            defaultValue: 1
        },
        // condition @see adc_filter.model.Condition
        {
            name: 'condition'
        }],
    proxy: {
        type: 'rest',
        url: 'rest/slbd_filter', //?idfield=condition&isPartial=1&isTransaction=1',
        batchActions: true,
        reader: {
            type: 'json',
            root: 'result'
        }
    }

});