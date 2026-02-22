import React, { useState } from "react";

/**
 * This component will be added to the searchResults page, and displays
 * a tag for each amenitty to filter the displayed rooms based on whether
 * they feature that specific amenity or not.
 *
 */
const AmenitiesFilter: React.FC = () => {
  // Dummy data
  const allAmenities = ["WiFi", "Parking", "Pool", "Gym"];

  // This is the state ro change the state of the tagged amenity
  const [selected, setSelected] = useState<string[]>([]);

  // Simple toggle function
  const toggle = (amenity: string) => {
    // Setting the state of the selected Amenity passing in the
    // previous list array []
    setSelected((previousList) => {
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
    <div style={{ padding: 20 }}>
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
            background: selected.includes(amenity) ? "#e26d5c" : "white",
            color: selected.includes(amenity) ? "white" : "#472d30;",
            cursor: "pointer",
          }}
        >
          {amenity}
        </button>
      ))}

      <p>{JSON.stringify(selected, null, 2)}</p>
    </div>
  );
};

export default AmenitiesFilter;
