
Ext.define('adc_filter.view.Filters', {
    extend: 'hscore.widgets.grid.Panel',
    models: ['adc_filter.model.Filter'],
    xtype: 'adc_filters',
    forceFit: true,
    border: false,
    displayCheckboxColumn: true,
    displayPagingToolbar: true,
    ctrlActionBtnOnSelCount: true,
    initComponent: function () {
        var me = this;


        Ext.apply(me, {
            store: Ext.create('Ext.data.Store', {
                model: 'adc_filter.model.Filter'
            }),

            tbar: {
                xtype: 'toolbar',
                border: false,
                width: '100%',
                items: [{
                    iconCls: 'btn-add',
                    text: getLangStr('common_button_new'),
                    action: 'add'
                }, {
                    iconCls: 'btn-edit',
                    text: getLangStr('common_button_edit'),
                    action: 'edit',
                    disabled: true
                }, {
                    iconCls: 'btn-del',
                    text: getLangStr('common_button_delete'),
                    action: 'del',
                    disabled: true
                }]
            },

            columns: [{
                text: getLangStr('policy_grid_id'), //ID,
                dataIndex: 'id',
                hidden: true,
                minWidth: 20,
                maxWidth: 50
            }, {
                text: getLangStr('common_label_name'),
                dataIndex: 'name'
            }, {
                text: getLangStr('adc_member_mum'),
                dataIndex: 'rule_count',
                minWidth: 20,
                maxWidth: 50,
                renderer2: function (v, rec) {
                    if (1) { }
                }
            }, {
                text: getLangStr('common_label_description'),
                dataIndex: 'description'
            }]

        });

        this.callParent();


    }
});