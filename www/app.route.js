diarios.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('login', {
    url: '/login',
    templateUrl:    'templates/login.html',
    controller :    'loginController'
  }).state('tab', {
    url:            '/tab',
    abstract:        true,
    templateUrl:    'templates/tabs.html',
    controller:     'tabsController'
  }).state('tab.capture', {
    cache:          false,
    url:            '/capture',
    templateUrl:    'templates/capture.html',
    controller:     'captureController'
  }).state('tab.todayhours',{
    cache:          false, 
    url :           '/todayhours',
    templateUrl:    'templates/todayhours.html',
    controller:     'todayController'
  }).state('tab.edithours',{
    url :           '/edithours',
    templateUrl:    'templates/edithoursUsers.html',
    controller:     'editUserHController'
  });

  $urlRouterProvider.otherwise('/login');

});
