
Ext.define('adc_filter.view.Filter', {
    extend: 'Ext.form.Panel',
    xtype: 'adc_filter',
    border: false,
    bodyPadding: '20',
    defaults: {
        allowBlank: true,
        width: 600
    },

    // overrides
    getValues: function () {
        return this.getForm().getValues(false, true, true, true);
    },
    initComponent: function () {

        var me = this;

        me.addEvents([
            'submit',
            'submit_success',
            'submit_fail'
        ]);

        Ext.apply(me, {
            items: [{
                xtype: 'textfield',
                name: 'name',
                fieldLabel: getLangStr('common_label_name'),
                afterBodyLabel: '(1-96)' + getLangStr('common_characters'),
                vtype: 'string',
                allowBlank: false,
                maxLength: 95
            }, {
                xtype: 'displayfield',
                fieldLabel: getLangStr('qos_qosc_condition')
            },
            {
                xtype: 'fieldcontainer',
                anchor: '100%',
                items: [{
                    xtype: 'adc_conditions',
                    name: 'condition',
                    showTbar: true,
                    width: 720,
                    minHeight: 100,
                    style: 'border-width: 1px;border-style: solid;'
                }]
            }, {
                xtype: 'textfield',
                name: 'description',
                fieldLabel: getLangStr('common_label_description'),
                afterBodyLabel: '(1-128)' + getLangStr('common_characters'),
                vtype: 'string',
                maxLength: 128
            }]
        });

        me.callParent();

        
    }
});