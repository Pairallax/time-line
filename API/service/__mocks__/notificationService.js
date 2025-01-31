const notificationServiceMock = jest.genMockFromModule(
    "../notificationService");
  
  function getRestaurantsByKeywordAndCoordinates(key, coord) {
    return new Promise(function(success, nosuccess){
      if(key.includes("Tim")){
          success({});
      }
      nosuccess({});
   });
  }

  notificationServiceMock.getRestaurantsByKeywordAndCoordinates = getRestaurantsByKeywordAndCoordinates;
  
  module.exports = notificationServiceMock;
