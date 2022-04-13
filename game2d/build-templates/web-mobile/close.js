//获取页面参数值;
function getUrlParameterValue(name) {
    let href = window.location.href;
    var query = href.substring(1);
    var vars = query.split("?");
    if (!vars[1]) {
      return '';
    }
    var argment = vars[1].split("&");;
    for (var i = 0; i < argment.length; i++) {
      var pair = argment[i].split("=");
      if (pair[0] == name) { return pair[1]; }
    }
    return '';
  }

  var lang_json = {
    "en": {
      "exitGame_lang": "Are you sure you quit the game?",
      "no_lang": "No",
      "yes_lang": "Yes"
    },
    "ar": {
      "exitGame_lang": "هل أنت متأكد من غلق اللعبة؟",
      "yes_lang": "نعم",
      "no_lang": "لا"
    },
    "hi": {
      "exitGame_lang": "क्या आप गेम छोड़ना सुनिश्चित करते हैं?",
      "yes_lang": "हाँ",
      "no_lang": "नहीं"
    },
    "te": {
      "exitGame_lang": "మీరు కచ్చితంగా గేమ్ ఆపాలి అనుకుంటున్నారా?",
      "yes_lang": "అవును",
      "no_lang": "కాదు"
    },
    "ta": {
      "exitGame_lang": "நீங்கள் விளையாட்டை விட்டு வெளியேறுவது உறுதியா?",
      "yes_lang": "ஆம்",
      "no_lang": "இல்லை"
    },
    "id": {
      "exitGame_lang": "Apakah Anda yakin keluar dari game?",
      "yes_lang": "Ya",
      "no_lang": "Bukan"
    },
    "vi": {
      "exitGame_lang": "Bạn có chắc chắn muốn thoát không?",
      "yes_lang": "Đúng",
      "no_lang": "Không"
    },
    "zh_Hant": {
      "exitGame_lang": "你確定要退出嗎？",
      "yes_lang": "是",
      "no_lang": "不"
    },
    "zh_Hans": {
      "exitGame_lang": "你确定要退出吗？",
      "yes_lang": "是",
      "no_lang": "不"
    }
  }



  var close_yes = document.getElementById('close_yes');
  close_yes.onclick = () => {
    window.NDB.closeWebView();
  }

  var close_no = document.getElementById('close_no');
  close_no.onclick = () => {
    document.getElementById('close_pop').style.visibility = 'hidden';
  }

  var ui_lang = getUrlParameterValue('ui_lang');
  if (ui_lang) {
    if (!lang_json[ui_lang]) {
      ui_lang = 'en';
    }
    document.getElementById('close_text').innerText = lang_json[ui_lang].exitGame_lang;
    document.getElementById('close_yes').innerText = lang_json[ui_lang].yes_lang;
    document.getElementById('close_no').innerText = lang_json[ui_lang].no_lang;
  }