
<?php foreach($modules as $module): ?>



Ext.define('<?= $module['@attributes']['name'] ?>.view.<?= ucfirst($module['@attributes']['name']) ?>s', {
    extend: 'hscore.widgets.grid.Panel',
    requires: ['hscore.utils.Utils'],
    xtype: 'adc_<?= $module['@attributes']['name'] ?>s',
    forceFit: true,
    border: false,
    header: false,
    config: {
        showTbar: true
    },
    
    initComponent: function () {
        var me = this,
            utils = hscore.utils.Utils;;


        
        Ext.apply(me, {
            tbar: {
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
            },
            store: Ext.create('Ext.data.Store', {
                model: '<?= $module['@attributes']['name'] ?>.model.<?= ucfirst($module['@attributes']['name']) ?>'
            }),
            displayCheckboxColumn: true,
            columns: [
            <?php foreach($module['Item'] as $index=>$field): ?>
                
                {
                    dataIndex: '<?= $field['@attributes']['name'] ?>',
                    text: getLangStr('<?= $field['@attributes']['name'] ?>')
                    <?php if ($this->getAfterFieldLabel($field) != ''): ?> <?php endif ?>
                    
                }<?php if ($index != sizeof($module['Item']) - 1): ?>, <?php endif ?>

                
                <?php endforeach ?>
                
        });

        this.callParent();
    }
});

    

<?php endforeach ?>

