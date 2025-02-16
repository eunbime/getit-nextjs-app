"use client";

import { ProductSchema } from "@/schemas";
import { useEffect, useState } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import { z } from "zod";

interface KakaoMapProps {
  latitude: number;
  longitude: number;
  setCustomValue?: (
    id: keyof z.infer<typeof ProductSchema>,
    value: number
  ) => void;
  detailPage?: boolean;
}

const KakaoMap = ({
  latitude,
  longitude,
  setCustomValue,
  detailPage = false,
}: KakaoMapProps) => {
  const [currentLocation, setCurrentLocation] = useState({ lat: 0, lng: 0 });
  const [center, setCenter] = useState({
    lat: latitude || 0,
    lng: longitude || 0,
  });

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
            setCustomValue?.("latitude", lat);
            setCustomValue?.("longitude", lng);
          }
        },
        (error) => {
          console.error("위치 정보를 가져오는데 실패했습니다:", error);
          // 기본 위치 설정 (예: 서울시청)
          const defaultLat = 37.5665;
          const defaultLng = 126.978;

          setCenter({ lat: defaultLat, lng: defaultLng });
          if (!detailPage) {
            setCustomValue?.("latitude", defaultLat);
            setCustomValue?.("longitude", defaultLng);
          }
        }
      );
    }
  }, [detailPage, latitude, longitude, setCustomValue]);

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
