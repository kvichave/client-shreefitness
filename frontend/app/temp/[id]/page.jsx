"use client";
import React from "react";
import { useParams } from "next/navigation";
function page() {
  const params = useParams(); // Extract parameters from the URL
  const id = params.id;
  return <div>page {id}</div>;
}

export default page;
