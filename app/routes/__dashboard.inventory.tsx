import InventoryTable from "~/components/inventory-table";
import { SiteHeader } from "~/components/site-header";

export default function Inventory() {
  return (
    <>
      <SiteHeader title="Inventory" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
            <InventoryTable />
          </div>
        </div>
      </div>
    </>
  );
}
