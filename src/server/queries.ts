import 'server-only'
import { auth } from '@clerk/nextjs/server'

import { db } from './db'
import { images } from './db/schema'
import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const getMyImages = async () => {
  const user = auth();

  if (!user.userId) throw new Error('Unauthorized');

  const images = await db.query.images.findMany({
    where: (model, { eq }) => eq(model.userId, user.userId),
    orderBy: (model, { asc }) => asc(model.id)
  })

  return images
}

const getImage = async (id: number) => {
  const user = auth()
  if(!user.userId) throw new Error("Unauthorized");

  const image = await db.query.images.findFirst({
    where: (model, { eq }) => eq(model.id, id)
  })
  if (!image) throw new Error("Image not found")

  if(user.userId !== image.userId) throw new Error("Unauthorized");

  return image;
}

const deleteImage = async (id: number) => {
  const user = auth();

  if (!user.userId) throw new Error("Unauthorized");

  await db
    .delete(images)
    .where(and(eq(images.userId, user.userId), eq(images.id, id)))

  revalidatePath("/");
  redirect("/")
}

export {getMyImages, getImage, deleteImage}
