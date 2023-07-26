import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { Input } from "./ui/input";
import {
  ProfileOwnedByMe,
  useUpdateProfileDetails,
  useUpdateProfileImage,
} from "@lens-protocol/react-web";
import useUpload from "@/lib/useUpload";
import { useLensHookSafely } from "@/lib/useLensHookSafely";
import { useRouter } from "next/router";
import { useState } from "react";

const FormSchema = z.object({
  name: z.string().min(3).max(20).optional(),
  bio: z.string().max(1000).optional(),
  profilePicture: z.any().optional(),
  coverPicture: z.any().optional(),
});

type Props = {
  profile: ProfileOwnedByMe;
};

export default function ProfileForm({ profile }: Props) {
  console.log(profile);
  const router = useRouter();
  const upload = useUpload();

  const updateProfile = useLensHookSafely(useUpdateProfileDetails, {
    profile: profile,
    upload: upload,
  });

  const updateProfileImage = useLensHookSafely(useUpdateProfileImage, {
    profile: profile,
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: profile.name || "",
      bio: profile.bio || "",
    },
  });

  const [profilePictureNew, setProfilePicture] = useState<File | undefined>();
  const [coverPictureNew, setCoverPicture] = useState<File | undefined>();

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      let profilePicture: string | undefined;
      let coverPicture: string | undefined;

      if (coverPictureNew) {
        coverPicture = await upload(coverPictureNew);
      }

      if (profilePictureNew) {
        profilePicture = await upload(profilePictureNew);
      }

      const updateProfileResult = await updateProfile?.execute({
        name: data.name || profile.name || "",
        bio: data.bio || profile.bio || "",
        // @ts-ignore
        coverPicture: coverPicture || profile.coverPicture.original.url || "",
      });

      if (profilePicture) {
        await updateProfileImage?.execute(profilePicture);
      }

      console.log(updateProfileResult);

      if (updateProfileResult?.isFailure()) {
        throw new Error(updateProfileResult.error.message);
      }

      toast({
        title: "Profile updated Successfully.",
      });

      router.push(`/profile/${profile.handle}`);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Something went wrong. Please try again later.",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display Name</FormLabel>
              <FormControl>
                <Input placeholder="Mario" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Input
                  placeholder="A short Italian plumber that likes to jump on turtles."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="profilePicture"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile Picture</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="file"
                  accept="image/*"
                  multiple={false}
                  onChange={(e) => {
                    if (e.target.files) {
                      setProfilePicture(e.target.files[0]);
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="coverPicture"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Picture</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="file"
                  accept="image/*"
                  multiple={false}
                  onChange={(e) => {
                    if (e.target.files) {
                      setCoverPicture(e.target.files[0]);
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-row items-center justify-between">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
}
