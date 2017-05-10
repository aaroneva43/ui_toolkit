<?php
/**
 * Class of utility functions for XML manipulation.
 * 
 * $array = xmlToArray($xmlString) Convert an XML string to an equivalent array.
 * $xmlString = arrayToXml($array) Convert an array to an equivalent XML string.
 *
 * See the accompanying doc file for details of use.
 * See the accompanying phpunit test file for examples of use.
 *
 * Please report any bugs to richard at roguewavelimited.com.  If possible include
 * a sample data file and description of the bug.
 *
 * If you have any suggestions on how to improve this class, let me know.
 * 
 * You are free to use this class in any way you see fit.
 *
 * Richard Williams
 * Rogue Wave Limited
 * Jan 2, 2011
 */

 namespace ui_toolkit;
 
class XmlHelper {

    // Name to use as name of attribute array.
    private $attributesArrayName = 'attributes';
    
    // Case folding  (uppercasing of names) is on by default (just like normal parser)
    private $foldCase = true;

    // Turn off values returned as arrays and ignore attributes.
    // Attributes and value arrays are on by default.
    private $noAttributes = false;

    // If true, then leaing and trailing whitespace is removed from attributes and values.
    // Off by default.
    private $trimText = false;

    // Vals returned by DOM parser.
    private $vals;

    // Name to use as name of value array.
    private $valueArrayName = 'value';
    
    public function __construct($noAttributes = false) {
        $this->noAttributes = $noAttributes;
    }   
    
    private function putChildren(DOMDocument &$dom, array $arr, DOMElement $node) {

        /*
         * Each node can be one of three types.  'value', an array indicating a sub-node
         * 'and 'attributes' indicating an array of attributes.
         */
        $arrayParent = null;
        
        foreach($arr as $name => $content) {
            
            if (strtoupper($name) == '@ATTRIBUTES') {
                foreach($content as $n => $v) {
                    $node->setAttribute($n, $v);
                }
            
            } else {

                // An integer index means that this starts a set
                // of elements with the same name.

                if (is_integer($name)) {
                    // Get the parent node and remove the integer element.

                    $child = $node;
                    if (is_null($arrayParent)) {

                        $arrayParent = $node->parentNode;
                        $arrayParent->removeChild($child);

                    } 
                    // else {
                        $child = $dom->createElement($node->tagName, (is_array($content) ? null : htmlspecialchars($content)));
                    // }
                    
                    $arrayParent->appendChild($child);

                } else {

                    $child = $dom->createElement($name, (is_array($content) ? null : htmlspecialchars($content)));
                    $node->appendChild($child);
                }
                
                if (is_array($content)) {
                    self::putChildren($dom, $content, $child);
                }
            }
        }
    }
    
    /*
     * Called recursively to parse the vals array.
     */
    private function getChildren ($vals, &$i, $type) {

        // If the type is 'complete' it means that there are no children of this element.

        $children = array ();

        if ($type != 'complete') {

            while ($vals [++$i]['type'] != 'close') {
                $type = $vals [$i]['type'];
                $tag = $vals [$i]['tag'];

                $valatt = $this->addAttributesAndValue($vals, $i);
                
                // Check if we already have an element with this name and need to create an array
                if (isset ($children [$tag])) {
                    // $temp = array_keys ($children [$tag]);   //bug, fixed by riki
                    $temp = array_keys ($children, $children [$tag]);     
                    
                    if (is_string ($temp [0])) {
                        $a = $children [$tag];
                        unset ($children [$tag]);
                        $children [$tag][0] = $a;
                    }
                    
                    if ($this->checkArrayMemberisArray($children [$tag])) {
                        $child = $this->getChildren($vals, $i, $type);
                        if (! empty($valatt)) {
                            $child = array_merge((array)$valatt, $child);
                        }
                        $children [$tag][] = $child;
                    }
                    else {
                        $children [$tag][] = $valatt;
                    }
                    
                } else {

                    $children [$tag] = $this->getChildren ($vals, $i, $type);

                    // If a scalar is returned from addAttributeAndValue just set that as the return
                    // otherwise merge it with the existing children.

                    if (! is_array($valatt)) {
                        $children[$tag] = $valatt;
                    } else {
                        if (! empty($valatt)) $children[$tag] = array_merge($valatt, $children[$tag]);
                    }
                }
            }
        }

        return $children;
    }
    
    /**
     * check if all the members of a array is array
     *
     * @param array $checkedArray the array need to check
     * @return bool is all members are array, return true, else return false
     */
    private function checkArrayMemberisArray($checkedArray) {
        foreach ($checkedArray as $arrayMember) {
            if (!is_array($arrayMember)) {
                return false;
            }
        }
        return true;
    }
    
    /**
     * Add any attributes or values from parser to the output array.
     *
     * @param array $vals Parser vals.
     * @param int $i Nesting level.
     * @return array.
     */
    private function addAttributesAndValue($vals, $i) {

        $array = array();
        if ($this->noAttributes) {
            if (isset ($vals[$i]['value'])) $array = $vals [$i]['value'];

        } else {
            if (isset ($vals[$i]['value'])) $array = array($this->valueArrayName => $vals [$i]['value']);
            if (isset ($vals[$i]['attributes']))
                $array = array_merge($array, array($this->attributesArrayName => $vals[$i]['attributes']));
        }
        return $array;
    }
    
    /**
     * 将数组转换为JSON
     * 使用json_encode转换数据为JSON时，中文字符会转成乱码，
     * 需要在之前先将数组中所有的中文字符进行url编码，再转换之后，在进行URL解码
     * 
     * @param Array $array 待转换的数组
     * @param boolean $json true 返回JSON false 返回数组
     * @return JSON 转换后的JSON字符串
     */
    private function convertArrayToJson($array, $json=true) {
        $this->arrayValueEncode($array);
        $jsonStr = json_encode($array, JSON_HEX_TAG);
        return $json? urldecode($jsonStr): json_decode(urldecode($jsonStr), true);
    }
    
    /**
     * 递归遍历数组，将数组中所有的中文进行url编码
     *
     * @param Array $array 待处理的数组
     */
    private function arrayValueEncode(&$array) {
        foreach ($array as $key=>$value) {
            if (is_array($array[$key])) {
                $this->arrayValueEncode($array[$key]);
            }
            else {
                // 处理'/'
                $value = addslashes($value);
                // 转换双引号
                $value = str_replace(array('"','%27'), "'", $value);
                $array[$key] = urlencode($value);
                
            }
            // else if ($this->isContainZh($value)) {
                // $array[$key] = urlencode($value);
            // }
        }
    }
    
    /**
     * 判断字符串中是否包含中文字符
     * 
     * @param string $value 待检查的字符串
     * @return bool
     */
    private function isContainZh($value) {
        if (preg_match("/([\x81-\xfe][\x40-\xfe])/", $value, $match)) {
            return true;
        } else {
            return false;
        }
    }
    
    /**
     * Create XML from an array.
     *
     * @param <type> $array
     * @param <type> $numericName Name to be used for numeric array indexes.
     */
    public function arrayToXml ($array) {
        $dom = new DOMDocument();
        //$dom->encoding = "ISO-8859-1";
        $dom->encoding = "UTF-8";
        
        $each = each($array);
        $root = $each[0];
        $array = $each[1];
		
        if (!is_array($array)) {
            $array = array("value"=>$array);
        }
        
        $rootNode = $dom->appendChild($dom->createElement($root));
		
        $this->putChildren($dom, $array, $rootNode);
        
        return $dom->saveXML();
    }

    /**
     * 创建DOMDocument
     *
     * @param string $xmlString XML字符串
     * @return DOMDocument $domDoc 
     */
    public function createDomDocument($xmlString) {
        $domDoc = new \DOMDocument();
        $domDoc->loadXML($xmlString);
        return $domDoc;
    }
    
    /**
     * 将DOMNode转换成DOMDocument
     * 
     * @param DOMNode $domNode 待转换的DOMNode
     * @return DOMDocument 返回转换后的DOMDocument
     */
    public function convertDomNodeToDomDocument($domNode) {
        $xmlDoc = new \DOMDocument();
        $xmlDoc->appendChild($xmlDoc->importNode($domNode, true));
        return $xmlDoc;
    }

    public function xmlToArray ($xmldata) {

        //$parser = xml_parser_create ('ISO-8859-1');
        $parser = xml_parser_create ('UTF-8');
        xml_parser_set_option($parser, XML_OPTION_SKIP_WHITE, 1);
        xml_parser_set_option($parser, XML_OPTION_CASE_FOLDING, $this->foldCase);

        $vals = array();
        if (!xml_parse_into_struct ($parser, $xmldata, $vals)) {
            throw new Exception(sprintf("XML error: %s at line %d",
                            xml_error_string(xml_get_error_code($parser)),
                            xml_get_current_line_number($parser)));        
        }
        $folding = xml_parser_get_option($parser, XML_OPTION_CASE_FOLDING);
        xml_parser_free ($parser);

        $this->vals = $vals;

        if ($folding) {
            $this->valueArrayName = strtoupper($this->valueArrayName);
            $this->attributesArrayName = strtoupper($this->attributesArrayName);
        }

        // Trim attributes and values if option set.

        if ($this->trimText) {
            foreach($vals as &$val) {
                if (count($val['attributes']) > 0) {
                    foreach($val['attributes'] as $name => $att) {
                        if ($this->trimText) $val['attributes'][$name] = trim($att);
                    }
                }
                if (isset($val['value'])) {
                    if ($this->trimText) $val['value'] = trim($val['value']);
                }
            }
        }

        $i = 0;
        $children = $this->getChildren ($vals, $i, $vals[$i]['type']);

        // Add value and attributes to if present.

        $valatt = $this->addAttributesAndValue($vals, 0);
        if (! empty($valatt)) $children = array_merge($valatt, $children);

        $result [$vals [$i]['tag']] = $children;
        return $result;
    }

    public function xmlToArray2($xml) {
        
        $this->normalizeSimpleXML(simplexml_load_string($xml), $result);
        return $result;
    }

    private function normalizeSimpleXML($obj, &$result) {
        $data = $obj;
        if (is_object($data)) {
            $data = get_object_vars($data);
        }
        if (is_array($data)) {
            foreach ($data as $key => $value) {
                $res = null;
                $this->normalizeSimpleXML($value, $res);
                
                // if (is_string($res) && $this->isContainZh($res)) {
                    // $res = urlencode($res);
                // }
                $result[$key] = $res;
            }
        } else {
            // if ($this->isContainZh($data)) {
                // $data = urlencode($data);
            // }
            $result = $data;
        }
    }
    
    /**
     * Provides access to the parser's vals array.
     * @return array of parser vals
     */
    public function getParserVals() {
        return $this->vals;
    }

    /**
     * If true then values are returned as raw values instead of as a 'VALUE' array.
     * Also attributes are ignored.
     * @param boolean $switch
     */
    public function setNoAttributes($switch) {
        $this->noAttributes = $switch;
    }

    /**
     * Set case folding (uppercasing) of all returned array names.
     * This includes any value and attribute arrays.
     * @param boolean $switch
     */
    public function setCaseFolding($switch) {
        $this->foldCase = $switch;
    }

    /**
     * If set, trims leading and trailing white space from attribute value and value text.
     * @param boolean $switch
     */
    public function setTrimText($switch) {
        $this->trimText = $switch;
    }
    
    /**
     * 从XML字符串中过滤掉非法字符
     *
     * @param string $value XML字符串
     * @return string 返回过滤掉非法字符后的XML字符串
     */
    public function stripInvalidXml($value){
        $ret = "";
        $current;
        if (empty($value)) {
            return $ret;
        }

        $length = strlen($value);
        for ($i=0; $i < $length; $i++) {
            $current = ord($value{$i});
            if (($current == 0x9) ||
                ($current == 0xA) ||
                ($current == 0xD) ||
                (($current >= 0x20) && ($current <= 0xD7FF)) ||
                (($current >= 0xE000) && ($current <= 0xFFFD)) ||
                (($current >= 0x10000) && ($current <= 0x10FFFF)))
            {
                $ret .= chr($current);
            }
        }
        return $ret;
    }
    
    /**
     * 判断某节点是否是叶子节点
     *
     * @param DOMNode $node 待检查的DomNode
     * @return bool 
     */
    public function isLeafNode($node) {
        if (isset($node->childNodes)) {
            if ($node->childNodes->length == 0) {
                return true;
            }
            else if ($node->childNodes->length > 1) {
                return false;
            }
            else if ($node->childNodes->length == 1) {
                if ($node->childNodes->item(0)->childNodes) {
                    return false;
                }
                else {
                    return true;
                }
            }
            else {
                return false;
            }
        }
        else {
            return true;
        }        
    }
    
    /**
     * 判断nodelist下是否存在指定node
     * @param DOMNodeList $nodeList 
     * @param DOMNode $outNode 待判断的Node
     * @return bool
     */
    public function existsInNodeList($nodeList, $outNode) {
        foreach ($nodeList as $enumNode) {
            if ($this->isSameNode($enumNode, $outNode)) {
                return true;
            }
        }
        return false;
    }
    
    /**
     * 判断两个XML节点是否相同
     *
     * @param DOMNode $node1 第一个节点
     * @param DOMNode $node2 第二个节点
     * @param bool
     */
    public function isSameNode($node1, $node2) {
        if ($node1->nodeName != $node2->nodeName) {
            return false;
        }
        else {
            if ($node1->nodeValue == $node2->nodeValue) {
                return true;
            }
            else {
                return false;
            }
        }
    }
    
    /**
     * convert JSON to XML
     
     * @param JSON $jsonStr
     * @return XML
     */
    public function convertJsonToXml($jsonStr) {
        $msgArray = json_decode($jsonStr, true);
        $msgXml = $this->arrayToXml($msgArray); 
        return $msgXml;
    }
    
    /**
     * convert XML to JSON
     *
     * @param JSON $jsonStr
     * @return mixed JSON | array
     */
    public function convertXmlToJson($xmlStr, $json=true) {
        $msgArray = $this->xmlToArray2($xmlStr);
        $jsonStr = $this->convertArrayToJson($msgArray, $json);
        return $jsonStr;
    }
}
