/**
 * This is the API-handler of your app that contains all your API routes.
 * On a bigger app, you will probably want to split this file up into multiple files.
 */
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { publicProcedure, router } from "../../../server/trpc";
import type { NextRequest } from "next/server";
import { z } from "zod";
import md5 from "md5";
import prisma from "@/server/prisma";

const appRouter = router({
  saveSearchResponse: publicProcedure
    .input(
      z.object({
        keyword: z.string().min(1),
        start: z.string().optional(),
        display: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const params = new URLSearchParams({
        query: input.keyword,
        display: input.display ?? "10",
        start: input.start ?? "1",
        sort: "sim",
        filter: "naverpay",
        exclude: "used:rental:cbshop",
      }).toString();
      const requestUrl =
        `https://openapi.naver.com/v1/search/shop.json?` + params;
      const res = await fetch(requestUrl, {
        headers: {
          "X-Naver-Client-Id": process.env.NAVER_CLIENT_ID as string,
          "X-Naver-Client-Secret": process.env.NAVER_CLIENT_SECRET as string,
        },
      }).then((res) => res.json());
      const items = res.items as { link: string; title: string }[];

      const newItems = await Promise.all(
        items.map(async (item) => {
          const translatedTitle = await translate(item.title);
          const mobileProductUrl = await getMobileProductUrl(item.link);
          return {
            ...item,
            link: mobileProductUrl,
            title: translatedTitle,
          };
        })
      );
      const modifiedRes = {
        ...res,
        items: newItems,
      };

      const { items: modifiedItems, lastBuildDate, ...rest } = modifiedRes;
      try {
        await prisma.response.create({
          data: {
            lastBuildDate: new Date(lastBuildDate),
            ...rest,
            items: {
              createMany: {
                data: modifiedItems,
              },
            },
          },
          include: {
            items: true,
          },
        });
      } catch (error) {
        console.log(error);
      }

      return modifiedRes;
    }),
});

// export only the type definition of the API
// None of the actual implementation is exposed to the client
export type AppRouter = typeof appRouter;

// We're using the edge-runtime
export const config = {
  runtime: "edge",
};

// export API handler
export default async function handler(req: NextRequest) {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    router: appRouter,
    req,
    createContext: () => ({}),
  });
}

async function translate(q: string) {
  const appid = process.env.BAIDU_TRANSLATE_ID as string;
  const key = process.env.BAIDU_TRANSLATE_SECRET as string;
  const salt = new Date().getTime().toString();
  const from = "auto";
  const to = "en";
  const str = appid + q + salt + key;
  const sign = md5(str);
  const params = new URLSearchParams({
    q,
    from,
    to,
    appid,
    salt,
    sign,
  }).toString();

  const res = await fetch(
    "http://api.fanyi.baidu.com/api/trans/vip/translate?" + params
  ).then((res) => res.json());

  return res?.["trans_result"]?.[0]?.["dst"] ?? "";
}

async function getMobileProductUrl(link: string) {
  const htmlString = await fetch(link).then((res) => res.text());
  const regex = /"mobileProductUrl":"([^"]+)"/;
  const match = htmlString.match(regex);
  const mobileProductUrl = match ? match[1] : null;
  return mobileProductUrl;
}
