import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const cat = await prisma.category.upsert({
    where: { id: "cat-demo" },
    update: {},
    create: { id: "cat-demo", name: "有声书" },
  });

  const album = await prisma.album.upsert({
    where: { id: "album-demo" },
    update: {},
    create: {
      id: "album-demo",
      title: "示例有声书",
      cover: "/placeholder.png",
      description: "本地磁盘方案示例专辑",
      author: "HarryListenly",
      categoryId: cat.id,
      playCount: 0,
      subscribeCount: 0,
      episodeCount: 2,
    },
  });

  await prisma.episode.upsert({
    where: { id: "ep-demo-1" },
    update: {},
    create: {
      id: "ep-demo-1",
      albumId: album.id,
      title: "第1集",
      duration: 120,
      audioUrl: "/audio/album-demo/ep1.mp3",
      order: 1,
    },
  });
  await prisma.episode.upsert({
    where: { id: "ep-demo-2" },
    update: {},
    create: {
      id: "ep-demo-2",
      albumId: album.id,
      title: "第2集",
      duration: 180,
      audioUrl: "/audio/album-demo/ep2.mp3",
      order: 2,
    },
  });

  console.log("Seed done: category, album, 2 episodes.");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
