'use strict';
var myApp = angular.module('app', [
	'ui.bootstrap',
  'ngResource',
	'lbServices'
]);

myApp.controller('AdminController', function($scope, $http, $window, Novedad, Archivo) {
  function getNovedades() {
    Novedad.find({
      filter: {
        order: 'id DESC'
      }
    },function(data) {
      console.log(data);
      $scope.novedades = data;
    });
  }

  function getFiles() {
    Archivo.find({
      filter: {
        where: {
          tipo: 'eaton'
        },
        order: 'id DESC'
      }
    }, function(data) {
      $scope.eaton = data[0];
      console.log(2222, data[0]);
    }, function(err) {
      console.log(err);
    });

    Archivo.find({
      filter: {
        where: {
          tipo: 'zf'
        },
        order: 'id DESC'
      }
    }, function(data) {
      $scope.zf = data[0];
      console.log(2222, data[0]);
    }, function(err) {
      console.log(err);
    });

    Archivo.find({
      filter: {
        where: {
          tipo: 'list'
        },
        order: 'id DESC'
      }
    }, function(data) {
      $scope.lista = data[0];
      console.log(2222, data[0]);
    }, function(err) {
      console.log(err);
    });
  }

  getFiles();

  getNovedades();

  $scope.novedad = {
    fecha: moment().format('DD-MM-YYYY'),
    descripcion: ''
  };

  $scope.agregarNovedad = function() {
    Novedad.create({
      fecha: $scope.novedad.fecha,
      descripcion: $scope.novedad.descripcion
    }, function(data) {
      getNovedades();
      console.log(data);

    }, function(err) {
      console.log(err);
    });
  };

  $scope.toDelete = [];

  $scope.addToRemove = function(id) {
    function include(arr,obj) {
      return (arr.indexOf(obj) != -1);
    }
    if (include($scope.toDelete, id)) {
      var index = $scope.toDelete.indexOf(id);
      $scope.toDelete.splice(index, 1);
    } else {
      $scope.toDelete.push(id);
    }
  };

  $scope.removeSelected = function() {
    angular.forEach($scope.toDelete, function(value, key) {
      console.log(key, value);
      $http.delete('http://localhost:3000/api/Novedads/' + value)
        .success(function(data) {
          getNovedades();
        })
        .error(function(err) {
          console.log(err);
        });
    });
  };

  $scope.result = "";

  $scope.download = function(name) {
    console.log($scope.eaton);
    if (name === 'eaton') {
      $window.location.assign('http://179.43.123.169:3001/api/containers/files/download/' + $scope.eaton.imagen);
    } else if (name === "zf") {
      $window.location.assign('http://179.43.123.169:3001/api/containers/files/download/' + $scope.zf.imagen);
    }
  };

  $scope.auth = function() {
      console.log('auth');
      var pw = prompt("Por favor ingrese la contraseña");
      if (pw == "turtuadmin") {
        window.location.assign('http://179.43.123.169:3001/admin.html');
      } else if (pw == "turtu14") {
        window.location.assign('http://179.43.123.169:3001/api/containers/files/download/' + $scope.lista.imagen);
      } else if (pw == "TURTU14") {
        window.location.assign('http://179.43.123.169:3001/api/containers/files/download/' + $scope.lista.imagen);
      }
  };

  $scope.upload = function() {

    console.log($scope.type);

      var fd = new FormData();

      angular.forEach($scope.file, function(file) {
        fd.append('file', file);
      });

     console.log($scope.file);

     console.log(fd);

     $http.post('/api/containers/files/upload',
        fd, {
          transformRequest: angular.identity,
          headers: {'Content-Type': undefined}
        }
      )
        .success(function(d){
          console.log(d);
          $scope.result = "El archivo " + $scope.file[0].name + " se ha subido correctamente";
          Archivo.create({
            tipo: $scope.type,
            imagen: $scope.file[0].name
          }, function(success) {
            console.log(success);
          });
        })
        .error(function(e) {
          console.log(e);
        });
    };

});

myApp.directive('eaton', function($parse) {
    return {
      restrict: 'A',
      link: function(scope, elm, attrs) {
        elm.bind('change', function() {
          $parse(attrs.eaton)
            .assign(scope, elm[0].files);
          scope.type = "eaton";
          scope.$apply();

          console.log(scope.file[0].name);
        });
      }
    }
  });

myApp.directive('zf', function($parse) {
    return {
      restrict: 'A',
      link: function(scope, elm, attrs) {
        elm.bind('change', function() {
          $parse(attrs.zf)
            .assign(scope, elm[0].files);
          scope.type = "zf";
          scope.$apply();

          console.log(scope.file[0].name);
        });
      }
    }
  });

myApp.directive('priceList', function($parse) {
    return {
      restrict: 'A',
      link: function(scope, elm, attrs) {
        elm.bind('change', function() {
          $parse(attrs.priceList)
            .assign(scope, elm[0].files);
          scope.type = "list";
          scope.$apply();

          console.log(scope.file[0].name);
        });
      }
    }
  });
