(function(){
    angular.module('barickOSApp')
    
    /*****************************************************************************
     * The Route
     *****************************************************************************/    
    .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
        $locationProvider.html5Mode(false);
        $locationProvider.hashPrefix('!');
        $routeProvider
        .when('/desktop', {
            templateUrl:'partials/desktop.html',
            controller: 'desktopCtrl'
        })
        .when('/', {
            redirectTo: '/desktop'
        })
        .otherwise({
            redirectTo: '/'
        });        
    }])
    
})()