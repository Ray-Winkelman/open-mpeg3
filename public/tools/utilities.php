<?php

/*
   This provides filesystem access, and other helpful functions.
   Author: Ray Winkelman, raywinkelman@gmail.com
   Date: August 4, 2017
*/


    function dirToArray($dir) { 
       
       $result = array(); 

       $cdir = scandir($dir); 
       foreach ($cdir as $key => $value) 
       { 

          $fullpath = $dir . DIRECTORY_SEPARATOR . $value;

          if (!in_array($value,array(".",".."))) 
          { 
             if (is_dir($fullpath)) 
             { 
                $result[$value] = dirToArray($fullpath); 
             } 
             else 
             { 
                $result[] = $fullpath;
             } 
          } 
       } 
       
       return $result; 
    } 

   function json_response($data){
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
    }

    function startsWith($haystack, $needle)
    {
         $length = strlen($needle);
         return (substr($haystack, 0, $length) === $needle);
    }

    function endsWith($haystack, $needle)
    {
        $length = strlen($needle);
        if ($length == 0) {
            return true;
        }

        return (substr($haystack, -$length) === $needle);
    }
