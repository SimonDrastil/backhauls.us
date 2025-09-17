"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";

import { formatCurrency } from "@/lib/utils/format";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

function BackhaulMapComponent({ listings, selectedId, onSelect }) {
  return (
    <div className="glass-panel relative flex h-[550px] w-full flex-col overflow-hidden">
      <div className="absolute inset-x-8 top-8 z-10 flex justify-between text-sm text-white/80">
        <span className="font-semibold uppercase tracking-widest text-white/60">Live backhauls</span>
        <span>Tap a market to sync the lane drawer & analytics</span>
      </div>
      <ComposableMap projection="geoAlbersUsa" style={{ width: "100%", height: "100%" }} className="pt-20">
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#0F2152"
                stroke="#0B3C8A"
                strokeWidth={0.6}
                style={{
                  default: { outline: "none" },
                  hover: { outline: "none", fill: "#1552A2" },
                  pressed: { outline: "none" },
                }}
              />
            ))
          }
        </Geographies>
        {listings.map((listing) => {
          const isSelected = listing.id === selectedId;
          return (
            <Marker
              key={listing.id}
              coordinates={[listing.coordinates.longitude, listing.coordinates.latitude]}
              onClick={() => onSelect(listing.id)}
            >
              <motion.g
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: Math.random() * 0.2 }}
                className="cursor-pointer"
              >
                <motion.rect
                  initial={false}
                  animate={{
                    scale: isSelected ? 1.05 : 1,
                    filter: isSelected ? "drop-shadow(0 0 12px rgba(47,178,76,0.85))" : "none",
                  }}
                  className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide ${
                    listing.status === "booked"
                      ? "fill-backhauls-dark"
                      : listing.status === "pending"
                        ? "fill-backhauls-light"
                        : "fill-backhauls-blue"
                  }`}
                  rx={16}
                  ry={16}
                  x={-48}
                  y={-32}
                  width={96}
                  height={32}
                />
                <text x={0} y={-12} textAnchor="middle" className="font-semibold text-[12px] fill-white">
                  {formatCurrency(listing.price)}
                </text>
                <text
                  x={0}
                  y={4}
                  textAnchor="middle"
                  className="text-[10px] font-medium uppercase tracking-[0.2em] fill-white/70"
                >
                  {listing.lane.destination}
                </text>
                <motion.circle
                  cx={0}
                  cy={16}
                  r={6}
                  fill={isSelected ? "#2FB24C" : "#54D66C"}
                  animate={{ scale: isSelected ? [1, 1.25, 1] : 1 }}
                  transition={{ repeat: isSelected ? Infinity : 0, duration: 1.2 }}
                  className="shadow-glass"
                />
              </motion.g>
            </Marker>
          );
        })}
      </ComposableMap>
    </div>
  );
}

export const BackhaulMap = memo(BackhaulMapComponent);
