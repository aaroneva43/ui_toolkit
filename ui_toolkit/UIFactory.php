<?php

namespace ui_toolkit\ui_toolkit;

use ui_toolkit\Plates\Engine;
use ui_toolkit\XmlHelper;
use ui_toolkit\Utils;

class UIFactory
{
    
    private $cfg = [];

    protected $engine = nll;
    
    public function __construct($cfg = []) {
        $this->cfg = array_merge(
            [
                tpl => 'module',
                module_prefix => 'prefix',
                tpl_path => './tpl'

            ],
            $cfg
        );

        $engine = new Engine($this->cfg['tpl_path']);

        

        $engine->registerFunction('getDataType', function ($type) { return (new Utils())->getDataType($type); });
        $engine->registerFunction('getXtype', function ($type) { return (new Utils())->getXtype($type); });
        $engine->registerFunction('getAfterFieldLabel', function ($type) { return (new Utils())->getAfterFieldLabel($type); });
        $engine->registerFunction('underline2Camel', function ($type) { return (new Utils())->underline2Camel($type); });

        $this->registerFunctions();



    }   
    
    private function registerFunctions() {

    }

    // to be overrided
    protected function getData($xmlStr) {
        $modules = $xmlHelper->xmlToArray2($xmlStr)['Attributes']['Attr'];
        $l1modules = []; // l1 module

        // handle single module scenario
        if (isset($modules['@attributes'])) $modules = [$modules];

        foreach ($modules as $index => $module) {
            if (isset($module['AttrL1'])) $l1modules = array_merge($l1modules, $module['AttrL1']);
        }

        return [ 'modules'=>array_merge($modules, $l1modules) ];
    }

    public function output($cfg= []) {
        $cfg = array_merge(
            [
                xml => file_exists('./inputput.js') ? file_get_contents('./input.xml') : '',
                output_path => './output.js',
                writefile => true

            ],
            $cfg
        );

        $output = $engine->render($this->tpl, $this->getData());

        if ($cfg['writefile'] === true)
            file_put_contents($cfg['output_path'], $output);

        
        return $output;
    }
}
