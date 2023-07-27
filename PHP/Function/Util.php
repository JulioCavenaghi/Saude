<?php

header('Content-type: text/html; charset=utf-8');

Class Util 
{

    public static function log($msg)
    {
        $fp = fopen('C:/xampp/htdocs/Saude/log/log.txt', 'a+');
        fwrite($fp, print_r($msg, true));
        fclose($fp); 
    }

}