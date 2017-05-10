
<?php foreach($modules as $module): ?>

    Ext.define('<?= $module['@attributes']['name'] ?>.view.<?= ucfirst($module['@attributes']['name']) ?>', {
        extend: 'Ext.form.Panel',
        xtype: 'adc_<?= $module['@attributes']['name'] ?>',
        requires: ['hscore.utils.Utils'],
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

            var me = this;

            Ext.apply(me, {
                items: [
                <?php foreach($module['Item'] as $index=>$field): ?>
                
                {
                    xtype: <?= $this->getXtype($field['dataType']['@attributes']['type']) ?>,
                    name: '<?= $field['@attributes']['name'] ?>',
                    fieldLabel: getLangStr('<?= $field['@attributes']['name'] ?>')
                    <?php if ($this->getAfterFieldLabel($field) != ''): ?>
                    ,
                    afterBodyLabel: '<?= $this->getAfterFieldLabel($field) ?>'
                    <?php endif ?>
                }

                <?php if ($index != sizeof($module['Item']) - 1): ?>, <?php endif ?>
                
        <?php endforeach ?>
                ]
            });

            me.callParent();
        }
    });

<?php endforeach ?>


