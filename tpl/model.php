
<?php foreach($modules as $module): ?>

    Ext.define('<?= $module['@attributes']['name'] ?>.model.<?= $this->underline2Camel($module['@attributes']['name']) ?>', {
        extend: 'Ext.data.Model',
        fields: [
        <?php foreach($module['Item'] as $index=>$field): ?>

            <?php if (isset($field['@attributes']['description'])): ?>
            /* <?= $field['@attributes']['description'] ?> */
            <?php endif ?>

            {
                name: '<?= $field['@attributes']['name'] ?>',
                type: '<?= $this->getDataType($field['dataType']['@attributes']['type']) ?>'
            }

            <?php if ($index != sizeof($module['Item']) - 1): ?>, <?php endif ?>
                
        <?php endforeach ?>
        ]

    });

<?php endforeach ?>