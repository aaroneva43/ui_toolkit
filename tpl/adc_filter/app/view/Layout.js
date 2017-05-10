
Ext.define('adc_filter.view.Layout', {
    extend: 'Ext.container.Container',
    requires: ['adc_filter.view.Filters', 'adc_filter.view.Conditions'],
    layout: 'border',
    initComponent: function () {
        var me = this;

        Ext.apply(me, {
            items: [

                {
                    xtype: "adc_filters",
                    region: 'center',

                },
                {
                    xtype: "adc_conditions",
                    region: 'south',
                    height: 320,
                    showTbar: false,
                    split: {
                        height: 1,
                        overCls: 'x-splitter-mouseover-row',
                        style: 'background:#ccc;'
                    },
                    collapsible: true,
                    collapseMode: 'mini',
                    hideCollapseTool: true
                }
            ]
        });
        
        me.callParent();
    }
});