"use server";

import { updateTag } from "next/cache";

export async function updateTags(tagTable:string[]) {
  for (const tag of tagTable) {
    updateTag(tag);
  }
}
