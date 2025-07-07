import React from "react";
import { redirect } from "next/navigation";

const page = () => {
  return redirect("/home");
};

export default page;
