
Ext.define('adc_filter.controller.Filter', {
    extend: 'hscore.app.controller.BaseSubModule',
    views: ['Filter', 'Condition'],
    mainpage: 'adc_filter.view.Filter',
    refs: [{
        ref: 'filter',
        selector: 'adc_filter'
    }],
    init: function () {
        var me = this;

        me.control({
            'adc_filter adc_conditions button[action=add]': {
                click: function () {
                    me.getConditionEditor('create').show();
                }
            },
            'adc_filter adc_conditions button[action=edit]': {
                click: function () {
                    me.getConditionEditor('update', me.getFilter().down('adc_conditions').selModel.getSelection()[0]).show();
                }
            },
            'adc_conditions': {

            }
        });
    },

    getConditionEditor: function (mode, rec) {
        var me = this,
            mode = mode || 'create',
            win = me.editor;

        if (!win) {
            me.editor = win = Ext.create('Ext.Window', {
                mode: mode,
                modal: true,
                closeAction: 'hide',
                items: [{
                    xtype: 'adc_condition'
                }],
                buttons: [{
                    text: getLangStr('common_button_ok'),
                    action: 'confirm',
                    handler: function (self) {
                        var form = win.down('adc_condition'),
                            f = form.getForm();

                        if (form.isValid()) {

                            if (form.getMode() == 'update') {
                                var values = form.getValues();
                                for (var p in values) {
                                    f.getRecord().set(p, values[p]);
                                }
                            } else if (form.getMode() == 'create') {
                                me.getFilter().down('adc_conditions').store.add(form.getValues());
                            }

                            win.close();
                        }

                    }
                }, {
                    text: getLangStr('common_button_cancel'),
                    action: 'cancel',
                    handler: function (self) {
                        win.down('adc_condition').form.clearInvalid().reset();
                        win.close();
                    }
                }]
            });
        } 
        
        win.down('adc_condition').setMode(mode);

        if (mode == 'create') {
            win.down('adc_condition').getForm().reset();
        } else {
            win.down('adc_condition').getForm().loadRecord(rec);
        }

        return win;

    },

    activate: function () {

    },
    /* @public */
    // fill: function (rec) { },

    /* @public */
    // submit: function (mode) { },
    /**
     * @public
     * 
     */
    assembleX: function () {
        var me = this,
            ruleFrom = me.getRuleFrom(),
            rule = ruleFrom.getValues(),
            rslt = [];



        Ext.Array.each(rule, function (r) {

            Ext.Object.each(r, function (key, value, o) {
                //if (v === undefined) delete o[key];
                // delete sub-decode fields

                console.log(key + ":" + value);
            });
        });



        return rslt;
    }

});