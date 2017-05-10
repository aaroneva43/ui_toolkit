<?php

namespace ui_toolkit;
 
class Utils {

    

    public function getDataType($type) {
        $type = strtolower($type);

        if (preg_match('/^integer|unsigned$/', $type)) {
            return 'int';
        }

        if (preg_match('/^string|ipv6_address|ipv4_address$/', $type)) {
            return 'string';
        }

        if (preg_match('/^bool|boolean$/', $type)) {
            return 'boolean';
        }

        return 'auto';
    }


    static public function getXtype($type) {
        $type = strtolower($type);

        if (preg_match('/^integer|unsigned|ipv6_address|ipv4_address$/', $type)) {
            return 'textfield';
        }


        if (preg_match('/^bool|boolean$/', $type)) {
            return 'checkbox';
        }

        return 'textfield';
    }

    public function getAfterFieldLabel($field) {

        $name = $field['@attributes']['name'];
        $type = strtolower($field['dataType']['@attributes']['type']);
        
        $datascope = $field['dataScope']['@attributes'];


        if (!isset($datascope)) return '';

        if (preg_match('/^string$/', $type)) {
            return '('. $datascope['min']. ' ~ '. $datascope['max']. ')'. ' getLangStr('+ $name +')';
        
        } else {
            return '('. $datascope['min']. ' ~ '. $datascope['max']. ')';

        }

        return '';
    }

    public function underLine2Camel($str) {

        $a = explode('_', $str);

        array_walk($a, function (&$v, $key) {
            $v = ucfirst($v);
        });

        return join('', $a);


    }


}