"use client";

import * as React from "react";

import { useRouter } from "next/navigation";
import Image from "next/image";

import * as z from "zod";

import axios from "axios";

import MuxPlayer from "@mux/mux-player-react";

import toast from "react-hot-toast";

import { ImageIcon, PencilIcon, PlusCircle, VideoIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Chapter, MuxData } from "@prisma/client";

import { FileUpload } from "@/components/file-upload";

const formSchema = z.object({
  videoUrl: z.string().min(1),
});

type TFormSchema = z.infer<typeof formSchema>;

interface ChapterVideoFormProps {
  initialData: Chapter & { muxData?: MuxData | null };
  courseId: string;
  chapterId: string;
}

export function ChapterVideoForm({
  initialData,
  courseId,
  chapterId,
}: ChapterVideoFormProps) {
  const [isEditing, setIsEditing] = React.useState(false);

  const router = useRouter();

  function toggleEdit() {
    setIsEditing((current) => !current);
  }

  async function onSubmit(values: TFormSchema) {
    try {
      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        values
      );

      toast.success("Chapter updated");
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  }

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter video
        <Button variant={"ghost"} onClick={toggleEdit}>
          {isEditing && <>Cancel</>}{" "}
          {!isEditing && !initialData.videoUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a video
            </>
          )}
          {!isEditing && initialData.videoUrl && (
            <>
              <PencilIcon className="h-4 w-4 mr-2" />
              Edit video
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData.videoUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <VideoIcon className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <MuxPlayer playbackId={initialData?.muxData?.playbackId || ""} />
          </div>
        ))}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="chapterVideo"
            onChange={(url) => {
              if (url) {
                onSubmit({ videoUrl: url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Upload this chapter&apos;s video
          </div>
        </div>
      )}
      {initialData.videoUrl && !isEditing && (
        <div className="text-xs text-muted-foreground mt-2">
          Videos can take a few minutes to proccess. Refresh the page if vidoe
          does not appear.
        </div>
      )}
    </div>
  );
}
