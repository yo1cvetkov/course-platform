"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import toast from "react-hot-toast";
import axios from "axios";

interface CourseEnrollButtonProps {
  price: number;
  courseId: string;
}

export function CourseEnrollButton({
  price,
  courseId,
}: CourseEnrollButtonProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  async function handleClick() {
    try {
      setIsLoading(true);

      const res = await axios.post(`/api/courses/${courseId}/checkout`);

      window.location.assign(res.data.url);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      size={"sm"}
      onClick={handleClick}
      disabled={isLoading}
      className="w-full md:w-auto"
    >
      Enroll for {formatPrice(price)}
    </Button>
  );
}
