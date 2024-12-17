"use client"
import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import Loading from "./Loading"

export default function MapLoader() {
    const Map = dynamic(() => import('./Map'), {
        loading: () => <Loading />,
        ssr: false
    });

    return (
        <Map />
    )
}