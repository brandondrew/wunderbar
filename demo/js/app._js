module Angular::PhonecatApp
  use :ngRoute, :PhonecatControllers

  case $routeProvider
  when '/phones'
    templateUrl = 'partials/phone-list.html'
    controller  = 'PhoneListCtrl'
  when '/phones/:phoneId'
    templateUrl = 'partials/phone-detail.html'
    controller = 'PhoneDetailCtrl'
  else
    redirectTo '/phones'
  end
end
