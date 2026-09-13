import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProtocolApp from "./ProtocolApp";

export const dynamic = "force-dynamic";

export default async function ClientProtocolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const client = await prisma.client.findUnique({
    where: { slug },
    include: {
      protocolItems: {
        where: { active: true },
        orderBy: { sortOrder: "asc" },
      },
      workoutDays: {
        include: { exercises: { orderBy: { sortOrder: "asc" } } },
      },
    },
  });

  if (!client) notFound();

  return (
    <ProtocolApp
      slug={slug}
      clientName={client.name}
      items={client.protocolItems}
      workoutDays={client.workoutDays}
    />
  );
}
