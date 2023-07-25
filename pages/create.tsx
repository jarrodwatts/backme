import { useState } from "react";
import { Nav } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useLensHookSafely } from "@/lib/useLensHookSafely";
import {
  DecryptionCriteriaType,
  MediaObject,
  useActiveProfile,
  useCreateEncryptedPost,
} from "@lens-protocol/react-web";
import { useSDK } from "@thirdweb-dev/react";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import fileToMimeType from "@/lib/fileToMimeType";
import fileToContentFocus from "@/lib/fileToContentFocus";

const Create = () => {
  const sdk = useSDK();
  const { toast } = useToast();

  // Form state
  const [file, setFile] = useState<File | null>(null);
  const [content, setContent] = useState<string>("");
  const [isFollowersOnly, setIsFollowersOnly] = useState<boolean>(false);

  const activeProfile = useLensHookSafely(useActiveProfile);

  const createEncrypted = useLensHookSafely(useCreateEncryptedPost, {
    // TODO: forcing sign in state rn (same with sdk beneath it too)
    publisher: activeProfile?.data!,
    upload: (data: unknown) => sdk!.storage.upload(data),
  });

  async function handleCreatePost() {
    // TODO:
    if (!file || !sdk || !activeProfile?.data) return;

    try {
      debugger;
      // Upload media first
      const mediaUrl = await sdk?.storage.upload(file);

      const mediaAttachment: MediaObject = {
        url: mediaUrl,
        mimeType: fileToMimeType(file),
      };

      const result = await createEncrypted?.execute({
        locale: "en-us",
        content: content,
        media: [mediaAttachment],
        animationUrl: "", // wat?
        contentFocus: fileToContentFocus(file),
        decryptionCriteria: {
          type: DecryptionCriteriaType.FOLLOW_PROFILE,
          profileId: activeProfile?.data?.id,
        },
      });

      console.log(result);

      if (result?.isFailure()) {
        throw new Error(result.error.message);
      } else {
        toast({
          title: "Post created!",
        });
      }
    } catch (error) {
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
