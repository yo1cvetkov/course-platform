"use client";

import * as React from "react";

import { useRouter } from "next/navigation";

import * as z from "zod";

import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";

import toast from "react-hot-toast";

import { PencilIcon } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
});

type TFormSchema = z.infer<typeof formSchema>;

interface TitleFormProps {
  initialData: {
    title: string;
  };

  courseId: string;
}

export function TitleForm({ initialData, courseId }: TitleFormProps) {
  const [isEditing, setIsEditing] = React.useState(false);

  const router = useRouter();

  function toggleEdit() {
    setIsEditing((current) => !current);
  }

  const form = useForm<TFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const { isSubmitting, isValid } = form.formState;

  async function onSubmit(values: TFormSchema) {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);

      toast.success("Successfully updated title");
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  }

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course title
        <Button variant={"ghost"} onClick={toggleEdit}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <PencilIcon className="h-4 w-4 mr-2" />
              Edit title
            </>
          )}
        </Button>
      </div>
      {!isEditing && <p className="text-sm mt-2">{initialData.title}</p>}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'Advanced web development'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
