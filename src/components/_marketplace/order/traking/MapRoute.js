import PropTypes from 'prop-types';
import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useJsApiLoader, GoogleMap, DirectionsRenderer } from '@react-google-maps/api';
import { Card, CardHeader, CardContent, Skeleton } from '@material-ui/core';


MapRoute.propTypes = {
    origin: PropTypes.string,
    destination: PropTypes.string,
};

export default function MapRoute({ origin, destination }){
    const {t} = useTranslation();
    const [directionsResponse, setDirectionsResponse] = useState();

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_PLACE_API_KEY,
    });

    const directionCallback = useCallback((response)=>{
        if (response !== null) {
            if (response.status === 'OK') {
              setDirectionsResponse(response)
            } else {
              console.log('response: ', response)
            }
          }
    },[])

   
     
     
    useEffect(()=>{
        if(window.google?.maps){
            const {maps} = window.google;
            const directionService = new maps.DirectionsService();
            if(directionService){
                    directionService.route({
                    origin,
                    destination,
                    travelMode: maps.TravelMode.DRIVING
                }, directionCallback)
            }   
        }
       
    },[origin, destination, directionCallback])

    if(!isLoaded){
        return <Skeleton variant="rectangular" height={365} sx={{ borderRadius: 2 }} />
    }
   
    return (
        <Card>
            <CardHeader title={t('tracking.mapTitle')}/>
            <CardContent>
                <GoogleMap
                zoom={15}
                mapContainerStyle={{ width: '100%', height: 365, borderRadius: 2}}
                options={{
                    streetViewControl: false,
                    zoomControl: false,
                    mapTypeControl: false,
                }}
                >
                    { directionsResponse && (
                    <DirectionsRenderer 
                        directions={directionsResponse}
                    />
                    )}
                </GoogleMap>
            </CardContent>
        </Card>
    )
}