import React from "react";
import { AmenitiesFilterProps } from "../../types/interfaces";

const AmenitiesFilter: React.FC<AmenitiesFilterProps> = ({
  allAmenities,
  selectedAmenities,
  setSelectedAmenities,
}) => {
  const toggle = (amenity: string) => {
    // Setting the state of the selected Amenity passing in the previous list array
    setSelectedAmenities((previousList) => {
      // Boolean variable which will be false or true depending on whether
      // the amenity was already clicked
      const isSelected = previousList.includes(amenity);

      // If it is selected, which means that the amenity had already been clicked
      // then we remove it from the list (it has been unclicked)
      if (isSelected) {
        // ...we create a new list which excludes the selected amenity
        const newList = previousList.filter((item) => item !== amenity);
        return newList;
      }

      // Add amenity to the previous list if isSelected is false
      const newList = [...previousList, amenity];
      return newList;
    });
  };

  return (
    <div>
      {/* We map all amenities */}
      {allAmenities.map((amenity) => (
        <button
          key={amenity}
          onClick={() => toggle(amenity)}
          style={{
            marginRight: 8,
            marginBottom: 8,
            padding: "6px 12px",
            borderRadius: 6,
            border: "1px solid #ccc",
            // Change the background color based on whether that amenity is selected ornot
            background: selectedAmenities.includes(amenity)
              ? "#e26d5c"
              : "white",
            // The same applies for the color
            color: selectedAmenities.includes(amenity) ? "white" : "black",
            cursor: "pointer",
          }}
        >
          {amenity}
        </button>
      ))}
    </div>
  );
};

export default AmenitiesFilter;
