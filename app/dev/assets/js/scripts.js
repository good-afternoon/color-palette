(function ($) {
  'use strict';

  /*===============================
    Header
  ================================*/

  function HEADER() {
    /**
    * ナビゲーション
    */
    var $headerMenu    = $('#header-hamburger'),
      $headerNav     = $('#header-nav'),
      $headerOverlay = $('#header-overlay'),
      headerFlag     = false;

    /**
    * メニューをクリックしたらナビを開閉
    */
    $headerMenu.on('click', function () {
      if (headerFlag) {
        headerClose();
      } else {
        headerOpen();
      }
    });

    /**
    * オーバーレイをクリックしたらナビを開閉
    */
    $headerOverlay.on('click', function () {
      headerClose();
    });

    /**
    * ナビを開く
    */
    function headerOpen() {
      $headerMenu.removeClass('-close').addClass('-open');
      $headerNav.removeClass('-close').addClass('-open');
      headerFlag = true;
    }

    /**
    * ナビを閉じる
    */
    function headerClose() {
      $headerMenu.removeClass('-open').addClass('-close');
      $headerNav.removeClass('-open');
      headerFlag = false;
    }
  }
  HEADER();

  /*===============================
    Archive
  ================================*/

  function ARCHIVE() {
    /**
    * jsonデータからパレット一覧を生成する
    */
    var archive_json_date, //日付
      archive_json_keyword, //キーワード
      archive_json_rgb, //色のRGB値
      $archive_object_item, //リスト要素
      $archive_object_palette, //パレット要素
      $archive_object_date, //日付要素
      $archive_object_square, //色オブジェクト
      arr_archive_json_colors = []; //色の配列を生成

    /**
    * アーカイブ用jsonデータの読み込み
    */
    $.ajax({
      type: 'GET',
      url: 'assets/json/archive/archives.json',
      datatype: 'json'
    })
      .done(function (json) {

        /**
        * 情報を格納
        * 配列の数だけループ
        */
        for (var i=0; i < json.archives.length; i++) {

          archive_json_date = json.archives[i].date; //日付を格納
          archive_json_keyword = json.archives[i].keyword; //キーワードを格納

          /**
          * 色を格納
          */
          // ループする度に色の配列をクリア
          arr_archive_json_colors = [];

          // colors配列の数だけループ処理
          for (var j=0; j < json.archives[i].colors.length; j++) {

            // color配列からRGB値を取得
            archive_json_rgb = json.archives[i].colors[j].color;

            // RGB → HEX(16進数) に変換し、push()メソッドを使用して配列に追加
            arr_archive_json_colors.push(rgb2hex( archive_json_rgb ) );

          }

          /**
          * jsonデータからDOM要素を生成
          */
          archive_object_append();
      }

    })
    .fail(function() {
    });


    /**
    * jsonデータからDOM要素を生成
    */
    function archive_object_append(){

      /**
      * DOMの生成
      */
      $archive_object_item = $('<li>', { //リスト要素
        addClass: 'archive-item',
      });

      $archive_object_palette = $('<div>', { //パレット要素
        addClass: 'archive-palette',
      });

      $archive_object_date = $('<p>', { //日付要素
        addClass: 'archive-date',
        text: archive_json_date, //日付を表示
      });

      /**
      * 生成した要素を表示
      * リスト, パレット, 日付
      */
      $('.archive-list').append($archive_object_item);
      $archive_object_item.append($archive_object_palette, $archive_object_date);

      /**
      * 色オブジェクトの生成
      * 色の配列の数だけループ処理をする
      */
      $.each(arr_archive_json_colors,
        function(index, elem) {

          /**
          * DOMの生成
          */
          $archive_object_square = $('<div>', {
            css: {backgroundColor: elem}, //色を背景色に設定
            addClass: 'obj-square',
          });

          /**
          * 生成した要素を表示
          * 色オブジェクト
          */
          $archive_object_palette.append($archive_object_square);
        }
      );
    }
  }
  if($('#-top').length){
    ARCHIVE();
  }


  /*===============================
    カラーコードの生成
  ================================*/
  // RGB → HEX(16進数) に変換
  function rgb2hex(rgb) {
      return "#" + rgb.map(function(value) {
      return("0" + value.toString(16)).slice(-2);
    }).join("");
  }


  /*===============================
    loading
  ================================*/
  function LOADING() {
    $('body').addClass('-load');
  }
  $(window).on('load', function() {
    LOADING();
  });


})(jQuery);