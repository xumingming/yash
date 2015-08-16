<html>
  <head>
    % include('head')    
    <!-- Create a simple CodeMirror instance -->
    <link rel="stylesheet" href="/static/lib/codemirror/5.5.0/codemirror.css">
    <script src="/static/lib/codemirror/5.5.0/codemirror.js"></script>
    <script src="/static/lib/codemirror/5.5.0/mode/sql.js"></script>
  </head>
  <body>
    % include('header')        
    <textarea id="code" rows="20" style="height:80%">
      {{code}}
    </textarea>
    <script>
      var myTextarea = document.getElementById("code");
      var editor = CodeMirror.fromTextArea(myTextarea,
      {
      lineNumbers: true,
      mode: '{{mode}}',
      readOnly: true,
      height: '100%'
      
      });
      editor.setSize("100%", "100%");
    </script>
    % include('footer')    
  </body>
</html>
