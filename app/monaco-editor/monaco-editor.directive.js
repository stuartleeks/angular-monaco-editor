'use strict';

angular
  .module('monacoEditor')
  .directive('monacoEditor', function ($interval) {

    function link(scope, element, attrs) {
      var editorElement = element[0];
      require(['vs/editor/editor.main'], function () {
        var editor = window.monaco.editor.create(editorElement, {
          value: scope.code,
          language: scope.language
        });
        // TODO - look up api docs to find a suitable event to handle as the onDidChangeModelContent event only seems to fire for certain changes!
        // As a fallback, currently updating scope on a timer...
        // editor.onDidChangeModelContent = function(e){
        //   console.log('modelContent changed');
        //   scope.code = editor.getValue();
        //   scope.$apply();
        // }
        function updateScope() {
          scope.code = editor.getValue();
        };
        $interval(updateScope, 1000); // TODO - need to clear the interval when the directive is torn down
      });
    }

    return {
      link: link,
      scope: {
        code: '=code',
        language: '=language'
      }
    };
  });
