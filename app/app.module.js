'use strict';

var codeeditorApp = angular.module('codeeditorApp', [
  'monacoEditor'
]);


codeeditorApp.controller('CodeController', function ($scope) {

  $scope.themes = ['vs-dark', 'vs', 'hc-black'];
  $scope.selectedTheme = $scope.themes[0];
  
  $scope.codeFiles = [
    {
      'filename': 'sample-file.js',
      'code': ['function x() {',
        '\tconsole.log("Hello world - this is monaco!");',
        '}'].join('\n'),
      'language': 'javascript'
    },
    {
      'filename': 'sample-file.cs',
      'code': `using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VS
{
\tclass Program
\t{
\t\tstatic void Main(string[] args)
\t\t{
\t\t\tProcessStartInfo si = new ProcessStartInfo();
\t\t\tfloat load= 3.2e02f;

\t\t\tsi.FileName = @"tools\\\\node.exe";
\t\t\tsi.Arguments = "tools\\\\simpleserver.js";

\t\t\tProcess.Start(si);
\t\t}
\t}
}`,
      'language': 'csharp'
    },
    {
      'filename': 'sample.go',
      'code': `// You can edit this code!
// Click here and start typing.
package main

import "fmt"

func main() {
\tfmt.Println("Hello, 世界")
}`,
      'language': 'go',
      'useSpaces': false
    }
  ];

  $scope.selectedCodeFile = $scope.codeFiles[2];

})