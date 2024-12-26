"use client";

import { useEffect, useState } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";

interface KakaoMapProps {
  latitude: number;
  longitude: number;
  setCustomValue?: (id: string, value: number) => void;
  detailPage?: boolean;
}

const KakaoMap = ({
  latitude,
  longitude,
  setCustomValue,
  detailPage = false,
}: KakaoMapProps) => {
  const [currentLocation, setCurrentLocation] = useState({ lat: 0, lng: 0 });
  const [center, setCenter] = useState({ lat: 0, lng: 0 });

  // 처음 로드될 때 현재 위치를 초기화
  useEffect(() => {
    if (!detailPage && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          setCurrentLocation({ lat, lng });
          if (!latitude && !longitude) {
            setCenter({ lat, lng });
          }
        },
        (error) => {
          console.error("현재 위치를 가져오는데 실패했습니다:", error);
        }
      );
    } else {
      console.log("이 브라우저에서는 위치 정보를 지원하지 않습니다.");
    }
  }, [detailPage]);

  // latitude, longitude가 변경될 때 center 업데이트
  useEffect(() => {
    if (latitude && longitude) {
      setCenter({ lat: latitude, lng: longitude });
    }
  }, [latitude, longitude]);

  const handleClick = (mouseEvent: kakao.maps.event.MouseEvent) => {
    if (detailPage) return;
    const lat = mouseEvent.latLng.getLat();
    const lng = mouseEvent.latLng.getLng();

    setCenter({ lat, lng });
    setCustomValue?.("latitude", lat);
    setCustomValue?.("longitude", lng);
  };

  return (
    <Map
      center={center}
      style={{ width: "100%", height: "360px" }}
      onClick={(_, mouseEvent) => handleClick(mouseEvent)}
    >
      <MapMarker position={center} />
    </Map>
  );
};

export default KakaoMap;
