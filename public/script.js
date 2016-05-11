
var app = angular.module('app',['ngRoute']);
app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/edit/:employeeId', {
                templateUrl: 'editEmployee.html',
                controller: 'editCtrl'
            }).
            when('/create', {
                templateUrl: 'createEmployee.html',
                controller: 'createCtrl'
            }).
            when('/info/:employeeId', {
                templateUrl: 'employeeInfo.html',
                controller: 'infoCtrl'
            }).
            when('/report/:managerId', {
                templateUrl: 'directReportList.html',
                controller: 'reportCtrl'
            }).
            when('/', {
                templateUrl: 'employeeList.html',
                controller: 'listCtrl'
            }).
            otherwise({
                redirectTo: '/'
            });
    }]);

app.filter('offset', function() {
    return function(input, managerId) {
        var directReportEmployees = {};
        if (input != null) {
            for (var i = 0; i < Object.keys(input[managerId]["directReports"]).length; i++) {
                directReportEmployees[i] = input[input[managerId]["directReports"][i]];
            }
        }
        return directReportEmployees;
    };
});

app.controller('createCtrl',function($scope, $location, appFactory, $routeParams) {
    appFactory.getEmployees($scope);

    $scope.createEmployee = function() {
        $scope.newEmployee = {};
        $scope.newEmployee["Name"] = $scope.Name;
        $scope.newEmployee["Title"] = $scope.Title;
        $scope.newEmployee["startDate"] = $scope.startDate;
        $scope.newEmployee["officePhone"] = $scope.officePhone;
        $scope.newEmployee["cellPhone"] = $scope.cellPhone;
        $scope.newEmployee["SMS"] = $scope.SMS;
        $scope.newEmployee["Email"] = $scope.Email;
        $scope.newEmployee["Manager"] = $scope.Manager;
        $scope.newEmployee["directReports"] = $scope.directReports == null ? [] : $scope.directReports;
        uploadFile(callback);
        function callback(imgPath) {
            $scope.newEmployee["pic"] = imgPath;
            appFactory.createEmployee($scope.newEmployee, callback1);

        }
        function callback1(newEmployeeUid) {
            $location.url("/info/" + newEmployeeUid);
        }
    }
});

app.controller('editCtrl',function($scope, $location, appFactory, $routeParams) {

    appFactory.getEmployees($scope);
    $scope.employeeId = $routeParams.employeeId;
    appFactory.getEmployee($scope.employeeId, callback);
    function callback(responseEmployee) {
        $scope.employee = responseEmployee;
        $scope.Name = $scope.employee.Name;
        $scope.Title = $scope.employee.Title;
        $scope.startDate = $scope.employee.startDate;
        $scope.officePhone = $scope.employee.officePhone;
        $scope.cellPhone = $scope.employee.cellPhone;
        $scope.SMS = $scope.employee.SMS;
        $scope.Email = $scope.employee.Email;
        $scope.Manager = $scope.employee.Manager;
        $scope.directReports = $scope.employee.directReports;
        $scope.pic = $scope.employee.pic;
    }


    $scope.editEmployee = function() {
        $scope.newEmployee = {};
        $scope.newEmployee["uid"] = $scope.employeeId;
        $scope.newEmployee["Name"] = $scope.Name;
        $scope.newEmployee["Title"] = $scope.Title;
        $scope.newEmployee["startDate"] = $scope.startDate;
        $scope.newEmployee["officePhone"] = $scope.officePhone;
        $scope.newEmployee["cellPhone"] = $scope.cellPhone;
        $scope.newEmployee["SMS"] = $scope.SMS;
        $scope.newEmployee["Email"] = $scope.Email;
        $scope.newEmployee["Manager"] = $scope.Manager;
        $scope.newEmployee["directReports"] = $scope.directReports == null ? [] : $scope.directReports;
        $scope.newEmployee["pic"] = $scope.pic;
        if (isUpload) {
            uploadFile( function callback(imgPath) {
                $scope.newEmployee["pic"] = imgPath;
                appFactory.editEmployee($scope.newEmployee, callback1);
            });
        } else {
            appFactory.editEmployee($scope.newEmployee, callback1);
        }

        function callback1() {
            $location.url("/info/" + $scope.employeeId);
        }
    }
});


app.controller('reportCtrl',function($scope, $location, appFactory, $routeParams) {

    $scope.managerId = $routeParams.managerId;
    appFactory.getEmployees($scope);
    $scope.changeViewBack = function() {
        var url = appFactory.getURLs();
        $location.url(url == null ? "/" : url);
    }
    $scope.changeView = function() {
        console.log($scope.managerId);
        appFactory.addURLs("/report/" + $scope.managerId);

    }
});

app.controller('listCtrl',function($scope, $location, appFactory) {
    appFactory.getEmployees($scope);
    $scope.changeView = function(param) {
        appFactory.addURLs("/");
    }
});

app.controller('infoCtrl',function($scope, $location, appFactory, $routeParams) {
    $scope.employeeId = $routeParams.employeeId;
    appFactory.getEmployee($scope.employeeId, callback);
    function callback(responseEmployee) {
        $scope.employee = responseEmployee;
        $scope.hasManager = $scope.employee.Manager == "" ? false : true;
        $scope.hasDirectReports = $scope.employee.directReports.length == 0 ? false : true;
        appFactory.getEmployeeName($scope.employee.Manager, callback1);
    }
    function callback1(responseEmployeeManagerName) {
        $scope.employeeManagerName = responseEmployeeManagerName;
    }

    $scope.changeViewBack = function() {
        var url = appFactory.getURLs();
        $location.url(url == null ? "/" : url);
    }

    $scope.changeView = function() {
        appFactory.addURLs("/info/" + $scope.employeeId);
    }

});

app.factory('appFactory', function($http){
    var factory = {};
    var URLs = [];

    factory.getEmployees = function($scope) {
        $http.get("/users/list")
            .success(function(data, status, headers, config) {
                $scope.employees = data;
            });
    }
    factory.getEmployee = function(employeeId, callback) {
        $http.get("/users/info/" + employeeId)
            .success(function(data, status, headers, config) {
                callback(data);
            });
    }
    factory.getEmployeeName = function(employeeId, callback) {
        if (employeeId == "") {
            return "";
        } else {
            $http.get("/users/info/" + employeeId)
                .success(function(data, status, headers, config) {
                    callback(data.Name);
                });
        }
    }

    factory.createEmployee = function(newEmployee, callback) {
        if (newEmployee == null) {
            return "";
        } else {
            $http.post("/users/create", newEmployee)
                .success(function(data, status, headers, config) {
                    callback(data.uid);
                });
        }
    }

    factory.editEmployee = function(newEmployee, callback) {
        if (newEmployee == null) {
            return "";
        } else {
            $http.put("/users/edit", newEmployee)
                .success(function(data, status, headers, config) {
                    callback();
                });
        }
    }


    factory.getURLs = function() {
        return URLs.pop();
    }

    factory.addURLs = function(url) {
        URLs.push(url)
    }

    return factory;
});