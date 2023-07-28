import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { Input } from "./ui/input";
import {
  FollowPolicyType,
  ProfileOwnedByMe,
  useUpdateProfileDetails,
  useUpdateProfileImage,
  useUpdateFollowPolicy,
  Amount,
  useCurrencies,
} from "@lens-protocol/react-web";
import useUpload from "@/lib/useUpload";
import { useRouter } from "next/router";
import { useState } from "react";
import { Separator } from "./ui/separator";
import { Checkbox } from "./ui/checkbox";
import Link from "next/link";

const FormSchema = z.object({
  name: z.string().min(3).max(20).optional(),
  bio: z.string().max(1000).optional(),
  profilePicture: z.any().optional(),
  coverPicture: z.any().optional(),
  followPolicy: z
    .object({
      type: z
        .enum([FollowPolicyType.ANYONE, FollowPolicyType.CHARGE])
        .optional(),
      price: z.string().optional(),
    })
    .optional(),
});

type Props = {
  profile: ProfileOwnedByMe;
};

export default function ProfileForm({ profile }: Props) {
  const router = useRouter();
  const upload = useUpload();

  const currencies = useCurrencies();
  console.log(currencies?.data);

  const updateProfile = useUpdateProfileDetails({
    profile: profile,
    upload: upload,
  });

  const updateProfileImage = useUpdateProfileImage({
    profile: profile,
  });

  const updateFollowerPolicy = useUpdateFollowPolicy({
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

  const [newFollowerPolicy, setNewFollowerPolicy] = useState<FollowPolicyType>(
    profile.followPolicy.type
  );

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
    console.log(newFollowerPolicy);

    try {
      let profilePicture: string | undefined;
      let coverPicture: string | undefined;

      if (coverPictureNew) {
        coverPicture = await upload(coverPictureNew);
      }

      if (profilePictureNew) {
        profilePicture = await upload(profilePictureNew);
      }

      // If any profile data got updated...
      if (
        coverPicture ||
        data.name !== profile.name ||
        data.bio !== profile.bio
      ) {
        // 1. Profile info
        const updateProfileResult = await updateProfile?.execute({
          name: data.name || profile.name || "",
          bio: data.bio || profile.bio || "",
          // @ts-ignore
          coverPicture: coverPicture || profile.coverPicture.original.url || "",
        });

        if (updateProfileResult?.isFailure()) {
          throw new Error(updateProfileResult.error.message);
        }
      }

      // 2. Profile picture
      if (profilePicture) {
        const updateImageResult = await updateProfileImage?.execute(
          profilePicture
        );

        if (updateImageResult?.isFailure()) {
          throw new Error(updateImageResult.error.message);
        }
      }

      // 3. Follower policy
      if (newFollowerPolicy !== profile.followPolicy.type) {
        const erc20 = currencies?.data?.find((c) => c.symbol === "WMATIC")!;
        const amount = data.followPolicy?.price || "0";
        const fee = Amount.erc20(erc20, amount);

        const followerUpdateResult = await updateFollowerPolicy?.execute({
          followPolicy:
            newFollowerPolicy === FollowPolicyType.CHARGE
              ? {
                  type: FollowPolicyType.CHARGE,
                  amount: fee,
                  recipient: profile.ownedBy,
                }
              : {
                  type: FollowPolicyType.ANYONE,
                },
        });

        if (followerUpdateResult?.isFailure()) {
          throw new Error(followerUpdateResult.error.message);
        }
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
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Profile Information
        </h3>

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

        <Separator />

        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Subscription Settings
        </h3>

        <FormField
          control={form.control}
          name="followPolicy.type"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-2">
              <FormControl>
                <Checkbox
                  {...field}
                  checked={newFollowerPolicy === FollowPolicyType.CHARGE}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      field.value = FollowPolicyType.CHARGE;
                      setNewFollowerPolicy(FollowPolicyType.CHARGE);
                    } else {
                      field.value = FollowPolicyType.ANYONE;
                      setNewFollowerPolicy(FollowPolicyType.ANYONE);
                    }
                  }}
                />
              </FormControl>
              <FormLabel
                style={{
                  margin: 0,
                  marginLeft: 12,
                }}
              >
                Enable paid subscriptions
              </FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="followPolicy.price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Follow Price</FormLabel>
              <FormDescription>
                This is the price that followers pay to follow you. It uses{" "}
                <Link
                  href="https://polygonscan.com/token/0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270"
                  target="_blank"
                  className="underline font-semibold"
                >
                  Wrapped MATIC ($MATIC)
                </Link>
                .
              </FormDescription>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  defaultValue={
                    profile.followPolicy.type === FollowPolicyType.CHARGE
                      ? profile.followPolicy.amount.toNumber()
                      : 0
                  }
                  disabled={newFollowerPolicy === FollowPolicyType.ANYONE}
                  placeholder="0.00"
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
