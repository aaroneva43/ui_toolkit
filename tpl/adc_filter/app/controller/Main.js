/**
 * @author Aaron
 * @history 20170329 commit
 */

Ext.define('adc_filter.controller.Main', {
    extend: 'hscore.app.controller.BaseModule',
    views: ['Layout'],
    models: ['Filter', 'Condition'],
    requires: ['hscore.utils.Utils'],
    refs: [{
        ref: 'filtersGrid',
        selector: 'adc_filters'
    }, {
        ref: 'conditionsGrid',
        selector: 'adc_conditions'
    }, {
        ref: 'filterEditWin',
        selector: 'window#filterEditor'
    }],
    mainpage: 'adc_filter.view.Layout',

    init: function () {
        var me = this,
            utils = hscore.utils.Utils;

        me.control({
            'adc_filters': {
                selectionchange: function (self, selected, eOpts) {

                    var r = selected.length > 0 ? selected[0].get('condition') : [];

                    me.getConditionsGrid().store.loadData(Ext.Array.from(r));

                },
                itemdblclick: function (self, record, item, index, e, eOpts) {
                    me.getFilterEditWin('update', record).show();
                }
            },
            'adc_filters button[action=add]': {
                click: function () {
                    me.getFilterEditWin('create').show();
                }
            },
            'adc_filters button[action=del]': {
                click: function () {
                    Ext.Msg.confirm('', getLangStr('common_alert_delete'), function (btn) {
                        if (btn == 'yes') {
                            me.doDel({
                                store: me.getFiltersGrid().store,
                                records: me.getFiltersGrid().selModel.getSelection()
                            });

                        }

                    });

                }
            }
        });


    },


    activate: function () {
        this.getFiltersGrid().store.reload();

    },

    getFilterEditWin: function (mode, rec) {

        var me = this,
            win = me.getEditWin({
                mode: mode,
                widget: 'adc_filter.view.Filter',
                model: 'adc_filter.model.Filter',
                data: rec,
                cfg: {
                    itemId: 'filterEditor',
                    title: getLangStr('nav_menu_slb_filterrule') + getLangStr('common_btn_config'),
                    width: 768,
                    layout: 'fit',
                    listeners: {
                        'submit_success': function () {
                             win.close();
                             win.unmask();
                             me.getFiltersGrid().store.reload();
                        }
                    }
                }
            });

        return win;
    }


});