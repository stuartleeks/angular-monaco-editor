'use strict';

angular
  .module('monacoEditor')
  .directive('monacoEditor', function ($interval) {

    function link(scope, element, attrs) {
      var editorElement = element[0];
      require(['vs/editor/editor.main'], function () {
        var editorContext = {
          scope,
          element,
          attrs,
          getValueOrDefault: function getValueOrDefault(value, defaultValue) {
            if (angular.isUndefined(value) || value === null) {
              return defaultValue;
            } else {
              return value;
            }
          },
          onThemeChanged: function onThemeChanged(newValue, oldValue, scope) {
            var editorTheme;
            monaco.editor.setTheme(this.getValueOrDefault(newValue, 'vs-dark'));
          },
          updateScope: function updateScope() {
            this.scope.codeFile.code = this.editor.getValue();
          },
          onCodeFileChanged: function onCodeFileChanged(newValue, oldValue, scope) {
            console.log("codeFile changed");

            // update the language model (and set `insertSpaces`)
            var newModel = monaco.editor.createModel('', newValue.language);
            newModel.updateOptions({ insertSpaces: this.getValueOrDefault(newValue.useSpaces, true) });
            this.editor.setModel(newModel);

            // update the code
            this.editor.setValue(newValue.code);
          }
        };
        editorContext.editor = window.monaco.editor.create(editorElement, {
          value: scope.codeFile.code,
          language: scope.codeFile.language,
          theme: editorContext.getValueOrDefault(scope.editorTheme, 'vs-dark')
        });

        // TODO - look up api docs to find a suitable event to handle as the onDidChangeModelContent event only seems to fire for certain changes!
        // As a fallback, currently updating scope on a timer...
        // editor.onDidChangeModelContent = function(e){
        //   console.log('modelContent changed');
        //   scope.code = editor.getValue();
        //   scope.$apply();
        // }
        $interval(editorContext.updateScope.bind(editorContext), 1000); // TODO - need to clear the interval when the directive is torn down

        // set up watch for codeFile changes to reflect updates
        scope.$watch('codeFile', editorContext.onCodeFileChanged.bind(editorContext));
        scope.$watch('editorTheme', editorContext.onThemeChanged.bind(editorContext));
      });
    }

    return {
      link: link,
      scope: {
        codeFile: '=codeFile',
        editorTheme: '=editorTheme'
      }
    };
  });