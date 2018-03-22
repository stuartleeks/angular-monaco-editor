'use strict';

angular
  .module('monacoEditor')
  .directive('monacoEditor', function ($interval) {

    function link(scope, element, attrs) {
      var editorElement = element[0];
      require(['vs/editor/editor.main'], function () {
        var editor = window.monaco.editor.create(editorElement, {
          value: scope.codeFile.code,
          language: scope.codeFile.language
        });
        var editorContext = {
          scope,
          element,
          attrs,
          editor
        };
        editorContext.onCodeFileChanged = function onCodeFileChanged(newValue, oldValue, scope) {
          console.log("codeFile changed");

          // update the language model (and set `insertSpaces`)
          var newModel = monaco.editor.createModel('', newValue.language);

          var useSpaces;
          if (angular.isUndefined(newValue.useSpaces) || newValue.useSpaces === null) {
            useSpaces = true; // TODO - decide on default value when not bound
          } else {
            useSpaces = newValue.useSpaces;
          }
          newModel.updateOptions({insertSpaces: useSpaces});
          this.editor.setModel(newModel);

          // update the code
          this.editor.setValue(newValue.code);
        };
        // TODO - look up api docs to find a suitable event to handle as the onDidChangeModelContent event only seems to fire for certain changes!
        // As a fallback, currently updating scope on a timer...
        // editor.onDidChangeModelContent = function(e){
        //   console.log('modelContent changed');
        //   scope.code = editor.getValue();
        //   scope.$apply();
        // }
        function updateScope() {
          scope.codeFile.code = editor.getValue();
        };
        $interval(updateScope, 1000); // TODO - need to clear the interval when the directive is torn down

        // set up watch for codeFile changes to reflect updates
        scope.$watch('codeFile', editorContext.onCodeFileChanged.bind(editorContext));
      });
    }

    return {
      link: link,
      scope: {
        codeFile: '=codeFile'
      }
    };
  });
