<?php
use ui_toolkit\Plates\Engine;
use ui_toolkit\XmlHelper;
use ui_toolkit\Utils;





$xmlHelper = new XmlHelper();
$engine = new Engine('./tpl');

// $utils->underline2Camel('a_b_c');

$xmlStr = file_get_contents('./input.xml');
$tpl = 'model';

// handle arguments
foreach ($argv as $arg) {
    $arg = explode("=", $arg);
    if ($arg[0] == 'tpl') {
        $tpl = $arg[1];
    }
}

// register funs
$engine->registerFunction('getDataType', function ($type) { return (new Utils())->getDataType($type); });
$engine->registerFunction('getXtype', function ($type) { return (new Utils())->getXtype($type); });
$engine->registerFunction('getAfterFieldLabel', function ($type) { return (new Utils())->getAfterFieldLabel($type); });
$engine->registerFunction('underline2Camel', function ($type) { return (new Utils())->underline2Camel($type); });


if (file_exists('./output.js')) {

    $modules = $xmlHelper->xmlToArray2($xmlStr)['Attributes']['Attr'];
    $l1modules = []; // l1 module

    // handle single module scenario
    if (isset($modules['@attributes'])) $modules = [$modules];

    foreach ($modules as $index => $module) {
        if (isset($module['AttrL1'])) $l1modules = array_merge($l1modules, $module['AttrL1']);
    }

    file_put_contents('./output.js', $engine->render($tpl, [ 'modules'=>array_merge($modules, $l1modules) ]));
}
    



















// autoload classes
function __autoload($class) {

	// convert namespace to full file path
	$class = '/'. str_replace('\\', '/', $class) . '.php';
	require_once($class);

}

?>