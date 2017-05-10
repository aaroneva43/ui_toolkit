
Ext.define('adc_filter.view.Conditions', {
    extend: 'hscore.widgets.grid.Panel',
    requires: ['adc_filter.data.Dict', 'hscore.utils.Utils'],
    mixins: {
        field: 'Ext.form.field.Field'
    },
    xtype: 'adc_conditions',
    forceFit: true,
    border: false,
    header: false,
    config: {
        showTbar: true
    },
    // overrides
    setValue: function (v) {
        this.store.loadData(Ext.Array.from(v));
    },

    getValue: function (v) {
        return Ext.Array.pluck(this.store.getRange(), 'data');
    },



    initComponent: function () {
        var me = this,
            dict = adc_filter.data.Dict,
            utils = hscore.utils.Utils;;


        
        var tbar = {
            xtype: 'toolbar',
            itemId: 'ssRuleTbar',
            border: false,
            width: '100%',
            items: [{
                xtype: 'label',
                text: getLangStr('common_label_detailInfo')
            }]
        };
        var tbarWithBtn = {
            xtype: 'toolbar',
            itemId: 'ssRuleTbar',
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
            }],
            listeners: {
                render: function(self) {
                    var grid = self.up('grid');

                    grid.selModel.on('selectionchange', function (self, selected, eOpts) {
                        utils.setActionBtnStatus(grid.query('toolbar[dock=top] button'), selected);
                    });
                }
            }
        };

        Ext.apply(me, {
            tbar: me.getShowTbar() ? tbarWithBtn : tbar,
            store: Ext.create('Ext.data.Store', {
                model: 'adc_filter.model.Condition'
            }),
            displayCheckboxColumn: true,
            columns: [{
                text: getLangStr('slb_filter_element'),
                dataIndex: 'element',
                minWidth: 40,
                maxWidth: 60,
                renderer: function (v) {
                    return dict.get('element', v);
                }
            }, {
                text: getLangStr('slb_filter_element_name'),
                dataIndex: 'element_name',
                minWidth: 40,
                maxWidth: 60,
            }, {
                text: getLangStr('common_label_operator'),
                dataIndex: 'operator',
                minWidth: 20,
                maxWidth: 50,
                renderer: function (v) {
                    return dict.get('operator', v);
                }
            }, {
                text: getLangStr('slb_filter_arguments'),
                dataIndex: 'arguments'
            }]
        });

        this.callParent();
    }
});