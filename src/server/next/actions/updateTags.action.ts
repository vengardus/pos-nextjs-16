"use server";

import { updateTag } from "next/cache";

export async function updateTagsAction(tagTable: string[]) {
  for (const tag of tagTable) {
    updateTag(tag);
  }
}
