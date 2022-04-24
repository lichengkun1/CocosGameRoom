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

  var ui_lang = getUrlParameterValue('ui_lang');

  var Detector = {
    canvas: !!window.CanvasRenderingContext2D,
    webgl: (function () {
      try {
        var canvas = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
      } catch (e) {
        return false;
      }
    })(),
    workers: !!window.Worker,
    fileapi: window.File && window.FileReader && window.FileList && window.Blob,
    getWebGLErrorMessage: function () {
      var element = document.createElement('div');
      element.id = 'webgl-error-message';
      element.style.fontFamily = 'monospace';
      element.style.fontSize = '13px';
      element.style.fontWeight = 'normal';
      element.style.textAlign = 'center';
      element.style.background = '#fff';
      element.style.color = '#000';
      element.style.padding = '1.5em';
      element.style.width = '400px';
      element.style.margin = '5em auto 0';
      if (!this.webgl) {
        element.innerHTML = window.WebGLRenderingContext ? [
          'Your graphics card does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" rel="external nofollow" rel="external nofollow" style="color:#000">WebGL</a>.<br />',
          'Find out how to get it <a href="http://get.webgl.org/" rel="external nofollow" rel="external nofollow" style="color:#000">here</a>.'
        ].join('\n') : [
          'Your browser does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" rel="external nofollow" rel="external nofollow" style="color:#000">WebGL</a>.<br/>',
          'Find out how to get it <a href="http://get.webgl.org/" rel="external nofollow" rel="external nofollow" style="color:#000">here</a>.'
        ].join('\n');
      }
      return element;
    },
    addGetWebGLMessage: function (parameters) {
      var parent, id, element;
      parameters = parameters || {};
      parent = parameters.parent !== undefined ? parameters.parent : document.body;
      id = parameters.id !== undefined ? parameters.id : 'oldie';
      element = Detector.getWebGLErrorMessage();
      element.id = id;
      parent.appendChild(element);
    }
  };
  if (typeof module === 'object') {
    module.exports = Detector;
  }
  if (!Detector.webgl) {
    document.getElementById('toastDiv').style.visibility = 'visible';
    let href = window.location.href;
    var reg = new RegExp("(^|&)" + 'ui_lang' + "=([^&]*)(&|$)", "i");
    var r = href.substr(1).match(reg); //获取url中"?"符后的字符串并正则匹配
    var context = "";
    if (r != null)
      context = r[2];
    reg = null;
    r = null;
    // return context == null || context == "" || context == "undefined" ? "" : context;

    if (context) {
      switch (context) {
        case 'ar':
          document.getElementById('toast').innerText = 'نعتذر، لا يمكن لنظام اللعبة دعم الهواتف المحمولة الأقل من Android 6.0. الرجاء ترقية إصدار Android لهاتفك المحمول إلى 6.0 وما فوق.';
          break;
        case 'hi':
          document.getElementById('toast').innerText = 'क्षमा करें, गेम सिस्टम एंड्राइड 6.0 से नीचे के मोबाइल फोन का सपोर्ट नहीं कर सकता है। कृपया अपने मोबाइल फ़ोन के एंड्राइड वर्शन को 6.0 और उससे अधिक पर अपग्रेड करें।';
          break;
        case 'te':
          document.getElementById('toast').innerText = 'ఆండ్రాయిడ్ 6.0 కన్నా తక్కువ ఉన్న మొబైల్ ఫోన్ కు గేమ్ సిస్టమ్ పని చేయదు. దయచేసి మీ మొబైల్ ఫోన్ ఆండ్రాయిడ్ వెర్షన్ 6.0 పైన అప్డేట్ చేయండి.';
          break;
        case 'ta':
          document.getElementById('toast').innerText = 'மன்னிக்கவும், Android 6.0 க்குக் கீழே உள்ள மொபைல் போன்களை விளையாட்டு அமைப்பு ஆதரிக்க முடியாது. உங்கள் மொபைல் ஃபோனின் Android பதிப்பை 6.0 மற்றும் அதற்கு மேல் மேம்படுத்தவும்.';
          break;
        case 'id':
          document.getElementById('toast').innerText = 'Maaf, sistem game tidak dapat mendukung ponsel di bawah Android 6.0. Harap update versi Android di ponsel Anda ke 6.0 dan yang lebih baru.';
          break;
      }
    }
  }