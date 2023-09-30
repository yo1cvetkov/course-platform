"use client";

import * as React from "react";

import { useRouter } from "next/navigation";

import { Trash } from "lucide-react";

import toast from "react-hot-toast";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import axios from "axios";

interface ActionsProps {
  disabled: boolean;
  courseId: string;
  isPublished: boolean;
}

export function Actions({ disabled, courseId, isPublished }: ActionsProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const router = useRouter();

  async function handleClick() {
    try {
      setIsLoading(true);

      if (isPublished) {
        await axios.patch(`/api/courses/${courseId}/unpublish`);
        toast.success("Course unpublished");
        router.refresh();
      } else {
        await axios.patch(`/api/courses/${courseId}/publish`);
        toast.success("Course published");
        router.refresh();
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  async function onDelete() {
    try {
      setIsLoading(true);

      await axios.delete(`/api/courses/${courseId}`);

      toast.success("Course deleted");

      router.refresh();

      router.push(`/teacher/courses`);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={handleClick}
        disabled={disabled || isLoading}
        variant={"outline"}
        size={"sm"}
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button size={"sm"} disabled={isLoading}>
          <Trash className="w-4 h-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
}
