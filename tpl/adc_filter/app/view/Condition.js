
Ext.define('adc_filter.view.Condition', {
    extend: 'Ext.form.Panel',
    xtype: 'adc_condition',
    requires: ['adc_filter.data.Dict', 'hscore.utils.Utils'],
    border: false,
    bodyPadding: '20',
    config: {
        mode: 'create'
    },
    defaults: {
        allowBlank: true,
        width: 600
    },
    initComponent: function () {

        var me = this,
            dict = adc_filter.data.Dict;

        Ext.apply(me, {
            items: [{
                xtype: 'hidden',
                name: 'id'
                
            }, {
                xtype: 'combo',
                name: 'element',
                fieldLabel: getLangStr('slb_filter_element'),
                editable: false,
                store: dict.get('element'),
                value: '1'
                
            }, {
                xtype: 'textfield',
                name: 'element_name',
                fieldLabel: getLangStr('slb_filter_element_name'),
                afterBodyLabel: '(1-128)' + getLangStr('common_characters'),
                vtype: 'string',
                maxLength: 128
            }, {
                xtype: 'combo',
                name: 'operator',
                fieldLabel: getLangStr('common_label_operator'),
                editable: false,
                store: dict.get('operator'),
                value: '1'
            }, {
                xtype: 'textfield',
                name: 'arguments',
                fieldLabel: getLangStr('slb_filter_arguments'),
                afterBodyLabel: '(1-128)' + getLangStr('common_characters'),
                vtype: 'string',
                maxLength: 128
            }]
        });

        me.callParent();
    }
});