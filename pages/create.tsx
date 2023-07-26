import { useState } from "react";
import { Nav } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useLensHookSafely } from "@/lib/useLensHookSafely";
import {
  CollectPolicyType,
  ContentFocus,
  DecryptionCriteriaType,
  MediaObject,
  ReferencePolicyType,
  useActiveProfile,
  useCreateEncryptedPost,
  useCreatePost,
} from "@lens-protocol/react-web";
import { useSDK } from "@thirdweb-dev/react";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import fileToMimeType from "@/lib/fileToMimeType";
import fileToContentFocus from "@/lib/fileToContentFocus";
import useUpload from "@/lib/useUpload";
import { useRouter } from "next/router";

const Create = () => {
  const router = useRouter();
  const sdk = useSDK();
  const upload = useUpload();
  const { toast } = useToast();

  // Form state
  const [file, setFile] = useState<File | null>(null);
  const [content, setContent] = useState<string>("");
  const [isFollowersOnly, setIsFollowersOnly] = useState<boolean>(false);

  const activeProfile = useLensHookSafely(useActiveProfile);

  const createEncrypted = useLensHookSafely(useCreateEncryptedPost, {
    // TODO: forcing sign in state rn (same with sdk beneath it too)
    publisher: activeProfile?.data!,
    upload: async (data: unknown) => upload(data),
  });

  const createUnencrypted = useLensHookSafely(useCreatePost, {
    publisher: activeProfile?.data!,
    upload: async (data: unknown) => upload(data),
  });

  async function handleCreatePost() {
    if (!sdk || !activeProfile?.data) return;

    let result;

    try {
      if (file) {
        console.log(file);
        const mediaUrl = await upload(file);

        console.log("Media:", mediaUrl);

        const mediaAttachment: MediaObject = {
          url: mediaUrl,
          mimeType: fileToMimeType(file),
        };

        // 1/4 File + Followers Only
        if (isFollowersOnly) {
          result = await createEncrypted?.execute({
            locale: "en-us",
            content: content,
            media: [mediaAttachment],
            animationUrl: "", // wat?
            contentFocus: fileToContentFocus(file),
            decryptionCriteria: {
              type: DecryptionCriteriaType.FOLLOW_PROFILE,
              profileId: activeProfile?.data?.id,
            },
            collect: {
              type: CollectPolicyType.NO_COLLECT,
            },
            reference: {
              type: ReferencePolicyType.ANYONE,
            },
          });
        }
        // 2/4 File + Public
        else {
          result = await createUnencrypted?.execute({
            locale: "en-us",
            content: content,
            media: [mediaAttachment],
            animationUrl: "", // wat?
            contentFocus: fileToContentFocus(file),
            collect: {
              type: CollectPolicyType.NO_COLLECT,
            },
            reference: {
              type: ReferencePolicyType.ANYONE,
            },
          });
        }
      } else {
        // 3/4 No File + Followers Only
        if (isFollowersOnly) {
          result = await createEncrypted?.execute({
            locale: "en-us",
            content: content,
            contentFocus: ContentFocus.TEXT_ONLY,
            decryptionCriteria: {
              type: DecryptionCriteriaType.FOLLOW_PROFILE,
              profileId: activeProfile?.data?.id,
            },
            collect: {
              type: CollectPolicyType.NO_COLLECT,
            },
            reference: {
              type: ReferencePolicyType.ANYONE,
            },
          });
        }
        // 4/4 No File + Public
        else {
          result = await createUnencrypted?.execute({
            locale: "en-us",
            content: content,
            contentFocus: ContentFocus.TEXT_ONLY,
            collect: {
              type: CollectPolicyType.NO_COLLECT,
            },
            reference: {
              type: ReferencePolicyType.ANYONE,
            },
          });
        }
      }

      console.log("Result:", result);

      if (result?.isFailure()) {
        throw new Error(result.error.message);
      } else {
        toast({
          title: "Post created!",
        });

        router.push(`/profile/${activeProfile.data.handle}`);
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error creating post.",
        description:
          "Something went wrong creating your post. Please try again later.",
        variant: "destructive",
      });
    }
  }

  return (
    <>
      <Nav />
      <div className="w-full container flex max-w-[64rem] flex-col items-center gap-4 h-screen">
        <div className="w-full md:w-[720px] p-2 py-4 rounded-sm">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Create Post
          </h1>

          <div className="grid w-full items-center gap-1.5 mt-4 ">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Your post content here..."
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div className="grid w-full items-center gap-1.5 mt-6">
            <Label htmlFor="picture">Media</Label>
            <Input
              id="picture"
              type="file"
              className="w-full h-20 border-dashed"
              onChange={(e) => {
                if (e.target.files) {
                  setFile(e.target.files[0]);
                }
              }}
            />
          </div>

          <div className="items-top flex space-x-2 mt-6">
            <Checkbox
              id="followers-only"
              checked={isFollowersOnly}
              onCheckedChange={() => setIsFollowersOnly(!isFollowersOnly)}
            />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor="followers-only"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Followers Only
              </Label>
              <p className="text-sm text-muted-foreground">
                Only your followers will be able to see this post.
              </p>
            </div>
          </div>

          <Button className="mt-6 w-full" onClick={handleCreatePost}>
            Create Post
          </Button>
        </div>
      </div>
    </>
  );
};

export default Create;
