import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

function PetInfo() {
  const { petId } = useParams();

  return (
    <div>
      <h1>aaaaaaaaaaaaaa : {petId}</h1>
    </div>
  );
}

export default PetInfo;
