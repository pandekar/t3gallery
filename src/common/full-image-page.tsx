import { clerkClient } from "@clerk/nextjs/server";

import { deleteImage, getImage } from "~/server/queries";
import { Button } from "../components/ui/button";

export default async function FullPageImageView(props: { id: number }) {
  const image = await getImage(props.id);

  const uploaderInfo = await clerkClient.users.getUser(image.userId)

  return (
    <div className="flex w-full h-full min-w-0">
      <div className="flex flex-shrink justify-center items-center">
        <img className="flex-shrink object-contain" src={image.url} />
      </div>

      <div className="flex flex-col w-auto flex-shrink-0 border-l border-white">
        <div className="p-2 border-b border-white text-lg text-center">{image.name}</div>
        <div className="p-2">
          <span>Uploaded by: </span>
          <span>{uploaderInfo.fullName}</span>
        </div>
        <div className="p-2">
          <span>Created on: </span>
          <span>{new Date(image.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="p-2">
          <form action={ async () => {
              "use server";

              await deleteImage(props.id)
            }}
          >
            <Button type="submit" variant="destructive">
              Delete
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
} 