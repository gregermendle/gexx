import { useLoaderData } from "react-router";
import { DataTable } from "~/components/data-table";
import { SiteHeader } from "~/components/site-header";

export async function loader() {
  const data = await import("~/dashboard/data.json");
  return data.default;
}

export default function Inventory() {
  const data = useLoaderData<typeof loader>();

  return (
    <>
      <SiteHeader title="Inventory" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <DataTable data={data} />
          </div>
        </div>
      </div>
    </>
  );
}
