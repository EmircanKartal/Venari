import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Modal,
  Typography,
  CircularProgress,
  DialogActions,
  DialogContent,
} from "@mui/material";
import { FaLocationArrow, FaTimes } from "react-icons/fa";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";

interface MapModalProps {
  eventCoordinates: google.maps.LatLngLiteral;
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
}

const MapModal: React.FC<MapModalProps> = ({
  eventCoordinates,
  open,
  onOpenChange,
}) => {
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const [isLoaded, setIsLoaded] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directionsResponse, setDirectionsResponse] =
    useState<google.maps.DirectionsResult | null>(null);
  const [distance, setDistance] = useState<string>(""); // Distance info
  const [duration, setDuration] = useState<string>(""); // Duration info
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]); // Track markers

  const originRef = useRef<HTMLInputElement>(null);

  if (!googleMapsApiKey) {
    throw new Error(
      "Google Maps API Key is not defined in the environment variables."
    );
  }

  // Load the Google Maps API
  const { isLoaded: loaderStatus } = useJsApiLoader({
    googleMapsApiKey,
    libraries: ["places"],
  });

  useEffect(() => {
    setIsLoaded(loaderStatus);
  }, [loaderStatus]);

  // Function to calculate the route between origin and destination
  async function calculateRoute() {
    if (originRef.current && eventCoordinates) {
      const directionsService = new google.maps.DirectionsService();

      const origin = originRef.current.value;
      const destination = eventCoordinates; // eventCoordinates is already the destination

      // Ensure origin and destination are valid
      if (!origin || !destination) {
        console.error("Origin or destination is missing.");
        return;
      }

      try {
        const results = await directionsService.route({
          origin,
          destination,
          travelMode: google.maps.TravelMode.DRIVING,
        });

        const route = results?.routes?.[0];
        const leg = route?.legs?.[0];

        if (leg) {
          setDirectionsResponse(results);
          setDuration(leg.duration?.text || "N/A"); // Set the duration
          setDistance(leg.distance?.text || "N/A"); // Set the distance

          // Add a marker for origin
          if (originRef.current?.value) {
            const originLatLng = originRef.current?.value.split(",");
            const marker = new google.maps.Marker({
              position: {
                lat: parseFloat(originLatLng[0] || "0"),
                lng: parseFloat(originLatLng[1] || "0"),
              },
              map,
              label: "Origin",
            });
            setMarkers((prev) => [...prev, marker]);
          }
        } else {
          console.error(
            "No valid route or leg found in the directions response."
          );
        }
      } catch (error) {
        console.error("Error fetching route:", error);
      }
    }
  }

  function clearRoute() {
    // Clear directions response and markers
    setDirectionsResponse(null);
    setDistance("");
    setDuration(""); // Clear the duration as well

    // Remove markers from the map
    markers.forEach((marker) => {
      marker.setMap(null); // Remove each marker from the map
    });
    setMarkers([]); // Clear the marker array

    if (originRef.current) originRef.current.value = ""; // Clear origin input
  }

  // When enter is pressed, trigger the calculateRoute function
  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Enter") {
      calculateRoute();
    }
  }

  useEffect(() => {
    if (map && eventCoordinates) {
      map.panTo(eventCoordinates); // Center map on the event location
    }
  }, [map, eventCoordinates]);

  if (!isLoaded) {
    return <CircularProgress />; // Show loading spinner if map is not loaded
  }

  return (
    <Modal open={open} onClose={() => onOpenChange(false)}>
      <Box
        sx={{
          position: "relative",
          height: "100vh",
          width: "100vw",
          backgroundColor: "transparent",
        }}
      >
        <GoogleMap
          center={eventCoordinates}
          zoom={15}
          mapContainerStyle={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onLoad={(map) => setMap(map)}
        >
          {/* Add markers for event and origin */}
          <Marker position={eventCoordinates} label="Event" />
          {markers.map((marker, index) => (
            <Marker
              key={index}
              position={marker.getPosition()!}
              label={marker.getLabel() ?? ""} // Ensure the label is a valid string or undefined
            />
          ))}
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>

        <Box
          sx={{
            position: "absolute",
            top: "2%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "35%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            zIndex: 10,
            backgroundColor: "white",
            padding: 3,
            borderRadius: 5,
            boxShadow: 3,
          }}
        >
          <DialogContent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Box
              sx={{ display: "flex", gap: 2, marginBottom: 2, width: "100%" }}
            >
              <TextField
                fullWidth
                label="Origin"
                variant="outlined"
                inputRef={originRef}
                onKeyDown={handleKeyDown} // Trigger on Enter
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaLocationArrow />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-around",
                width: "100%",
                marginTop: 2,
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                <Typography variant="body1" fontWeight="bold" color="black">
                  Duration:
                </Typography>
                <Typography variant="body1" color="black">
                  {duration}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                <Typography variant="body1" fontWeight="bold" color="black">
                  Distance:
                </Typography>
                <Typography variant="body1" color="black">
                  {distance}
                </Typography>
              </Box>
            </Box>
          </DialogContent>

          <DialogActions sx={{ width: "100%", justifyContent: "center" }}>
            <Button
              sx={{
                width: "100%",
                backgroundColor: "#1976d2", // Blue color
                color: "white",
                "&:hover": {
                  backgroundColor: "#1565c0",
                },
              }}
              variant="contained"
              onClick={calculateRoute}
            >
              Calculate Route
            </Button>
            <IconButton
              aria-label="clear route"
              onClick={clearRoute}
              color="error"
              sx={{ marginLeft: 1 }}
            >
              <FaTimes />
            </IconButton>
          </DialogActions>

          <IconButton
            aria-label="close modal"
            onClick={() => onOpenChange(false)}
            color="primary"
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              zIndex: 20,
            }}
          >
            <FaTimes />
          </IconButton>
        </Box>
      </Box>
    </Modal>
  );
};

export default MapModal;
