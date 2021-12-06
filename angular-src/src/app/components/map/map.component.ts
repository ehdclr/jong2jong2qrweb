import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';



@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  kakao= (window as any).kakao;

  mapOption: any;
  map: any;
  Search: string;
  ps = new this.kakao.maps.services.Places(); 
  infowindow : any;
  
  keyword='';
  pagination: string;
  markers = [] as Object;
  marker: any;
  
  onLocal(value: string) {  
    
    localStorage.setItem('input',value);
    console.log(value);

    this.kakao = (window as any).kakao;

   
    this.infowindow = new this.kakao.maps.InfoWindow({zIndex:1});

  var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
    mapOption = {
        center: new this.kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
        level: 3 // 지도의 확대 레벨
    };  
    
// 지도를 생성합니다    
this.map = new this.kakao.maps.Map(mapContainer, mapOption); 

// 장소 검색 객체를 생성합니다
this.ps = new this.kakao.maps.services.Places(); 
// var keyword = $('#keyword').val();

// 키워드로 장소를 검색합니다

 var ps = this.ps;

 var kakao = this.kakao;
 var map = this.map;
 var infowindow = this.infowindow;
 
searchPlaces();


 function searchPlaces() {

  var keyword = localStorage.getItem('input');

  // if (!keyword.replace(/^\s+|\s+$/g, '')) {
  //     alert('키워드를 입력해주세요!');
  //     return false;
  // }

  // 장소검색 객체를 통해 키워드로 장소검색을 요청합니다
  ps.keywordSearch( keyword, placesSearchCB); 
  
}




function placesSearchCB (data, status, pagination) {
  if (status === kakao.maps.services.Status.OK) {

      // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
      // LatLngBounds 객체에 좌표를 추가합니다
      var bounds = new kakao.maps.LatLngBounds();

      for (var i=0; i<data.length; i++) {
          displayMarker(data[i]);    
          bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
      }       

      // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
      map.setBounds(bounds);
  } 
}



// 지도에 마커를 표시하는 함수입니다
function displayMarker(place) {
    
    // 마커를 생성하고 지도에 표시합니다
    var marker = new kakao.maps.Marker({
        map: map,
        position: new kakao.maps.LatLng(place.y, place.x) 
    });

    // 마커에 클릭이벤트를 등록합니다
    kakao.maps.event.addListener(marker, 'click', function() {
        // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
        infowindow.setContent('<div style="padding:5px;font-size:12px;">' + place.place_name + '</div>');
        infowindow.open(map, marker);
    });
}

  }
  
  onremove(){
    localStorage.removeItem('input');
  }

  
  
  

  

  constructor(private authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {

    

    // 마커를 클릭하면 장소명을 표출할 인포윈도우 입니다
// const kakao = (window as any).kakao;
// var infowindow = new kakao.maps.InfoWindow({zIndex:1});

// var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
//     mapOption = {
//         center: new kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
//         level: 3 // 지도의 확대 레벨
//     };  

// // 지도를 생성합니다    
// var map = new kakao.maps.Map(mapContainer, mapOption); 

// // 장소 검색 객체를 생성합니다
// var ps = new kakao.maps.services.Places(); 

// // 키워드로 장소를 검색합니다
// ps.keywordSearch('이태원 맛집', placesSearchCB); 

//     this.kakao = (window as any).kakao;

   
//     this.infowindow = new this.kakao.maps.InfoWindow({zIndex:1});

// var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
//     mapOption = {
//         center: new this.kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
//         level: 3 // 지도의 확대 레벨
//     };  
    
// // 지도를 생성합니다    
// this.map = new this.kakao.maps.Map(mapContainer, mapOption); 

// // 장소 검색 객체를 생성합니다
// this.ps = new this.kakao.maps.services.Places(); 
// // var keyword = $('#keyword').val();

// // 키워드로 장소를 검색합니다

//  var ps = this.ps;

//  var kakao = this.kakao;
//  var map = this.map;
//  var infowindow = this.infowindow;
 
// searchPlaces();


//  function searchPlaces() {

//   var keyword = localStorage.getItem('input');

//   // if (!keyword.replace(/^\s+|\s+$/g, '')) {
//   //     alert('키워드를 입력해주세요!');
//   //     return false;
//   // }

//   // 장소검색 객체를 통해 키워드로 장소검색을 요청합니다
//   ps.keywordSearch( keyword, placesSearchCB); 
  
// }




// function placesSearchCB (data, status, pagination) {
//   if (status === kakao.maps.services.Status.OK) {

//       // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
//       // LatLngBounds 객체에 좌표를 추가합니다
//       var bounds = new kakao.maps.LatLngBounds();

//       for (var i=0; i<data.length; i++) {
//           displayMarker(data[i]);    
//           bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
//       }       

//       // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
//       map.setBounds(bounds);
//   } 
// }



// // 지도에 마커를 표시하는 함수입니다
// function displayMarker(place) {
    
//     // 마커를 생성하고 지도에 표시합니다
//     var marker = new kakao.maps.Marker({
//         map: map,
//         position: new kakao.maps.LatLng(place.y, place.x) 
//     });

//     // 마커에 클릭이벤트를 등록합니다
//     kakao.maps.event.addListener(marker, 'click', function() {
//         // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
//         infowindow.setContent('<div style="padding:5px;font-size:12px;">' + place.place_name + '</div>');
//         infowindow.open(map, marker);
//     });
// }






}


// searchPlaces(value: string): any {
  

  
//   // if (!keyword.replace(/^\s+|\s+$/g, '')) {
//   //     alert('키워드를 입력해주세요!');
//   //     return false;
//   // }
  
 
  
//   // 장소검색 객체를 통해 키워드로 장소검색을 요청합니다
//   this.ps.keywordSearch( value, this.placesSearchCB); 
//   console.log(value);
  
// }


// placesSearchCB (data:any, status:any, pagination:any)  : any{
  
//   if (status === this.kakao.maps.services.Status.OK) {

//       // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
//       // LatLngBounds 객체에 좌표를 추가합니다
//       var bounds = new this.kakao.maps.LatLngBounds();

//       for (var i=0; i<data.length; i++) {
//           this.displayMarker(data[i]);    
//           bounds.extend(new this.kakao.maps.LatLng(data[i].y, data[i].x));
//       }       

//       // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
//       this.map.setBounds(bounds);
//   } 
// }


// // 지도에 마커를 표시하는 함수입니다
// displayMarker(place : any) :any {
  
//   // 마커를 생성하고 지도에 표시합니다
//   var marker = new this.kakao.maps.Marker({
//       map: this.map,
//       position: new this.kakao.maps.LatLng(place.y, place.x) 
//   });

//   // 마커에 클릭이벤트를 등록합니다
//   this.kakao.maps.event.addListener(marker, 'click', (req,res,err) => {
//       // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
//       this.infowindow.setContent('<div style="padding:5px;font-size:12px;">' + place.place_name + '</div>');
//       this.infowindow.open(marker.map, marker);
//   });
// }


 

}
