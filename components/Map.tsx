'use client'
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { LatLngExpression } from 'leaflet';
import { useUser } from '@auth0/nextjs-auth0/client';
import Loading from './Loading';
import mapUtils, { MapUtils } from '../utils/MapUtils';

const MapUpdater = ({ position }: { position: number[] }) => {
    const map = useMap();

    useEffect(() => {
        map.flyTo(position as LatLngExpression);
    }, [position, map])

    return null;
};

const Map = () => {
    const { user, isLoading } = useUser();
    const [appHeight, setAppHeight] = useState(null);
    const [positionInternal, setPositionInternal] = useState<number[]>(MapUtils.mapPositions);
    const zoom = 10;

    useEffect(() => {
        if (window)
            setAppHeight(window.innerHeight);
    }, [window])

    useEffect(() => {
        const handleMapPositionChange = (newPosition: number[]) => {
            if (newPosition !== positionInternal) {
                if (typeof newPosition === "string") {
                    newPosition = String(newPosition).split(',').map(x => parseFloat(x));
                }
                setPositionInternal(newPosition);
            }
        }
        mapUtils.subscribe(handleMapPositionChange);

        return () => {
            mapUtils.unsubsrcibe(handleMapPositionChange);
        }
    }, [])

    if (!isLoading && typeof window !== 'undefined') {
        return <MapContainer
            className={'app-map border-0'} 
            center={positionInternal as LatLngExpression} 
            zoom={zoom} 
            style={{ height: (appHeight ? `${appHeight}px` : '100%'), width: '100%' }}
            zoomControl={false}
            doubleClickZoom={true}
            zoomAnimation={true}            
            >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <MapUpdater position={positionInternal} />
        </MapContainer>;
    } else {
        return <Loading />
    }
};

export default Map;

