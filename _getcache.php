<?php
  $content = montarCache();
  sendJsonResponse($content);
  // $tamanho = count($content);
  // echo "Tamanho: $tamanho<br/>";
  // print_r($content);

  function sendJsonResponse($content){
    header('Content-Type: application/json');
    echo json_encode($content);
    exit;
  }

  function montarCache(){
    $diretorios = getDiretorios();
    $cache = array();
    foreach($diretorios as $dir){
      $files = scandir("./$dir");
      foreach($files as $file)
      {
        $cache[$file] = $dir;
      }
    }
    return $cache;
  }

  function getDiretorios(){
    $dirExcluidos = array("bootstrap","fonts", "img", "js", "layout");
    $diretorios=array();
    foreach(glob('./*', GLOB_ONLYDIR) as $dir) {
      $dirname = basename($dir);
      if (!in_array($dirname, $dirExcluidos)) { 
        array_push($diretorios, $dirname);
      }
    }
    array_push($diretorios, "");
    return $diretorios;
  }

  function getDuplicates ($array) {
    return array_unique( array_diff_assoc( $array, array_unique( $array ) ) );
  }
?>