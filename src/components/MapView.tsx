import { divIcon } from "leaflet";
import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import type { Entity } from "../types";
import { classificationColor, getClassification, getString, fieldAliases } from "../lib/data";

interface MapViewProps {
  entities: Entity[];
  selectedEntity: Entity | null;
  onSelectEntity: (entity: Entity) => void;
}

function markerIcon(entity: Entity, selected: boolean) {
  const color = classificationColor(getClassification(entity));
  return divIcon({
    className: "",
    html: `<span class="map-marker ${selected ? "map-marker-selected" : ""}" style="--marker-color:${color}"></span>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -12],
  });
}

function FlyToSelected({ entity }: { entity: Entity | null }) {
  const map = useMap();
  useEffect(() => {
    if (entity) {
      map.flyTo([entity.latitude, entity.longitude], Math.max(map.getZoom(), 5), { duration: 0.8 });
    }
  }, [entity, map]);
  return null;
}

export function MapView({ entities, selectedEntity, onSelectEntity }: MapViewProps) {
  const aliases = fieldAliases();

  return (
    <div className="map-shell">
      <MapContainer center={[25, 5]} zoom={2} minZoom={2} maxZoom={8} scrollWheelZoom className="h-full w-full" worldCopyJump>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <FlyToSelected entity={selectedEntity} />
        {entities.map((entity) => (
          <Marker
            eventHandlers={{ click: () => onSelectEntity(entity) }}
            icon={markerIcon(entity, selectedEntity?.id === entity.id)}
            key={entity.id}
            position={[entity.latitude, entity.longitude]}
          >
            <Popup>
              <div className="space-y-1">
                <strong>{entity.name}</strong>
                <p>{getString(entity.properties, aliases.institution)}</p>
                <p>
                  {getString(entity.properties, aliases.country)} · {getClassification(entity)}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div className="legend">
        <div className="legend-title">Classification</div>
        <div><span style={{ background: "#54d5ff" }} />A core</div>
        <div><span style={{ background: "#f4c96b" }} />B relevant</div>
        <div><span style={{ background: "#83e6b4" }} />C adjacent</div>
      </div>
    </div>
  );
}
